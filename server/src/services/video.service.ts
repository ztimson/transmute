import {Video} from '@transmute/common';
import fs from 'fs';
import {CrudApiService} from '../modules/crud-api/service';
import {getCodec, getResolution, getStreams} from '../utils/ffmpeg.utils';

export class VideoService extends CrudApiService<number, Video> {
	constructor() {
		super('video', 'id');
	}

	async afterRead(value: Video, list: boolean): Promise<Video> {
		value.audioTracks = JSON.parse(<any>value.audioTracks);
		value.subtitleTracks = JSON.parse(<any>value.subtitleTracks);
		return value;
	}

	async beforeWrite(value: Video, original: Video | null): Promise<Video> {
		value.audioTracks = <any>JSON.stringify(value.audioTracks);
		value.subtitleTracks = <any>JSON.stringify(value.subtitleTracks);
		return value;
	}

	async afterWrite(value: Video, original: Video | null): Promise<void> { }

	async scan(file: string): Promise<{resolution: string, videoCodec: string, audioCodec: string, audioTracks: string[], subtitleTracks: string[]}> {
		if(!fs.existsSync(file)) throw new Error(`File could not be found: ${file}`);
		return {
			resolution: getResolution(file),
			videoCodec: getCodec(file, 'video', 0),
			audioCodec: getCodec(file, 'audio', 0),
			audioTracks: getStreams(file, 'audio'),
			subtitleTracks: getStreams(file, 'subtitle')
		}
	}
}
