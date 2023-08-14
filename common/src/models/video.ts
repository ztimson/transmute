export const Resolution = {
	'240p': 240,
	'360p': 360,
	'480p': 480,
	'720p': 720,
	'1080p': 1080,
	'4k': 2160,
	'8k': 4320,
}

export enum Container {
	avi = 'AVI',
	mkv = 'MKV',
	mp4 = 'MP4',
	webm = 'WebM'
}

export enum VideoCodec {
	h264 = 'h.264 (AVC)',
	h265 = 'h.265 (HEVC)',
	h266 = 'h.266 (VVC)',
	mpeg2 = 'MPEG-2',
	mpeg4 = 'MPEG-4'
}

export enum AudioCodec {
	aac = 'AAC',
	ac3 = 'AC3',
	mp3 = 'MP3',
	vorbis = 'Ogg Vorbis',
	wav = 'WAV'
}

export type VideoMeta = {
	/** Closest standard (NOT actual) video resolution (420p, 720p, 1080p, etc..) */
	resolution: string;
	/** Algorithm used to encode video */
	videoCodec?: keyof VideoCodec;
	/** Algorithm used to encode audio */
	audioCodec?: keyof AudioCodec;
	/** List of available audio tracks */
	audioTracks?: string[];
	/** List of available subtitle languages */
	subtitleTracks?: string[];
}

export type Video = VideoMeta & {
	id?: number;
	/** Name of the file (extension included, path omitted: "sample.mp4") */
	name: string;
	/** Path to file */
	path: string;
	/** Library foreign key */
	library: number;
	/** Video container/File extension (Binds everything together) */
	container?: keyof Container;
	/** Whether the file is healthy or not; null if unchecked */
	checksum?: string;
	/** Size of file in bytes */
	healthy?: boolean;
	/** Checksum of file - useful for seeing if a file has changed */
	size: number;
}
