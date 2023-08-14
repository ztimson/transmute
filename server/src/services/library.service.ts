import {Library, Metrics} from '@transmute/common';
import {CrudApiService} from '../modules/crud-api/service';
import {existsSync, statSync} from 'fs';
import {BadRequestError} from '../utils/errors';
import {createChecksum, deepSearch, parseFilePath} from '../utils/file.utils';
import {VideoService} from './video.service';

export class LibraryService extends CrudApiService<number, Library> {
	constructor(private videoService: VideoService) {
		super('library', 'id');
	}

	async afterRead(value: Library, list: boolean): Promise<Library> {
		value.watch = (<any>value).watch == 1;
		return value;
	}

	async beforeWrite(value: Library, original: Library | null): Promise<Library> {
		if(!existsSync(value.path))
			throw new BadRequestError(`Library path is invalid: ${value.path}`);
		value.watch = <any>(value.watch ? 1 : 0);
		return value;
	}

	afterWrite(value: Library, original: Library): Promise<void> {
		return this.scan(value.id).then(() => {});
	}

	async delete(filter: Partial<Library> | number): Promise<void> {
		const id = typeof filter == 'object' ? filter.id : filter;
		await this.videoService.delete({library: id});
		return super.delete(filter);
	}

	async scan(library: number, force: boolean = false): Promise<number> {
		// Check if library exists
		const lib = await this.read(library);
		if(!existsSync(lib.path)) throw new BadRequestError(`Library path is invalid: ${lib.path}`)

		// Fetch list of previously scanned videos & current videos on disk
		const files = deepSearch(lib.path).filter(file => /\.(avi|mp4|mkv)$/gmi.test(file));
		const videos = await this.videoService.list({library});

		// Initial save to DB
		const saved = await Promise.all(files.map(async file => {
			const exists = videos.findIndex(v => v.path == file);
			if(exists != -1) return videos.splice(exists, 1)[0];
			const fileInfo = parseFilePath(file);
			return await this.videoService.create({
				name: fileInfo.fileName,
				path: file,
				library,
				container: fileInfo.extension,
				size: statSync(file).size
			});
		}));

		// Scan each file asynchronously
		Promise.all(saved.map(async video => {
			const checksum = await createChecksum(video.path);
			if(!force && video.checksum == checksum && !Object.values(video).includes(null)) return video;
			return this.videoService.update({
				...video,
				checksum,
				...(await this.videoService.scan(video.path)),
			});
		})).then(resp => {
			// Delete scans for files that no longer exist on disk
			videos.forEach(v => this.videoService.delete(v.id));
			return resp;
		});

		// Return number of discovered files
		return saved.length;
	}

	async scanAll(force: boolean = false): Promise<number> {
		const libraries = await this.list();
		return (await Promise.all(libraries.map(l => this.scan(l.id, force))))
			.reduce((acc, n) => acc + n, 0);
	}

	async metrics(library?: number): Promise<Metrics> {
		// Check if library exists
		if(library) await this.read(library);

		// Iterate over all video files & add up stats
		const stats: Metrics = {
			resolution: {},
			container: {},
			videoCodec: {},
			audioCodec: {},
			health: {healthy: 0, unhealthy: 0, unknown: 0},
			audioLang: {},
			subLang: {},
			size: 0,
			videos: 0
		};
		(await this.videoService.list(library != null ? {library} : undefined)).forEach(f => {
			// Resolution
			if(f.resolution) {
				if(!stats.resolution[f.resolution]) stats.resolution[f.resolution] = 0;
				stats.resolution[f.resolution]++;
			}

			// Container
			if(f.container) {
				if(!stats.container[f.container]) stats.container[f.container] = 0;
				stats.container[f.container]++;
			}

			// Video codec
			if(f.videoCodec) {
				if(!stats.videoCodec[f.videoCodec]) stats.videoCodec[f.videoCodec] = 0;
				stats.videoCodec[f.videoCodec]++;
			}

			// Audio codec
			if(f.audioCodec) {
				if(!stats.audioCodec[f.audioCodec]) stats.audioCodec[f.audioCodec] = 0;
				stats.audioCodec[f.audioCodec]++;
			}

			// Audio tracks
			f.audioTracks?.forEach(at => {
				if(!stats.audioLang[at]) stats.audioLang[at] = 0;
				stats.audioLang[at]++;
			});

			// Subtitles
			f.subtitleTracks?.forEach(st => {
				if(!stats.subLang[st]) stats.subLang[st] = 0;
				stats.subLang[st]++;
			});

			// Health
			stats.health[f.healthy == null ? 'unknown' : f.healthy ? 'healthy' : 'unhealthy']++;

			// Filesize
			stats.size += f.size;

			// Length
			stats.videos++;
		});
		return stats;
	}

	async videos(library?: number) {
		// Check if library exists
		if(library != null) await this.read(library);
		return this.videoService.list(library != null ? {library} : undefined);
	}
}
