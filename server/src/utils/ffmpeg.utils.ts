import {Resolution} from '@transmute/common';
import {execSync} from 'child_process';

/**
 * Use FFProbe to look up the encoding of a specific stream track
 *
 * @example
 * ```ts
 * console.log(getEncoding('./sample.mp4', 'video'));
 * // Output: 'h264'
 *
 * console.log(getEncoding('./sample.mp4', 'audio', 1));
 * // Output: 'ACC'
 * ```
 *
 * @param {string} file Absolute or relative path to video file
 * @param {"audio" | "subtitle" | "video"} stream Type of stream to inspect
 * @param {number} track Index of stream (if multiple are available; for example, bilingual audio tracks)
 * @returns {string} The encoding algorithm used
 */
export function getCodec(file: string, stream: 'audio' | 'subtitle' | 'video', track: number = 0): string {
	return execSync(
		`ffprobe -v error -select_streams "${stream[0]}:${track}" -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "${file}"`,
		{encoding: 'utf-8', shell: 'cmd'}).trim();
}

/**
 * Fetch resolution of video. Can either provide the real resolution or the closest standard resolution.
 *
 * @param {string} file Absolute or relative path to file
 * @param {boolean} real Return the real resolution or the closest standard
 * @returns {string} If real enabled, will return XY (1920x1020), if disabled, will return closes resolution tag (1080p)
 */
export function getResolution(file: string, real?: boolean): string {
	const fileRes = execSync(
		`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${file}"`,
		{encoding: 'utf-8', shell: 'cmd'});
	if(real) return fileRes;
	const y = Number(fileRes.split(',')[1]);
	return <string>Object.keys(Resolution).reduce((best:[string, number], res: string) => {
		const diff = Math.abs(y - Resolution[res]);
		return (best == null || best[1] > diff) ? [res, diff] : best;
	}, null)[0];
}

/**
 * Use FFProbe to get an ordered list of available tracks for a given stream, identified by the tagged language
 *
 * @example
 * ```ts
 * console.log(getStreams('./sample.mp4', 'audio'));
 * // Output: ['eng', 'fr', 'unk']
 * ```
 *
 * @param {string} file Absolute or relative path to video file
 * @param {"audio" | "subtitle" | "video"} stream Type of stream to inspect
 * @returns {string[]} Ordered list of available tracks & their respective tagged language
 */
export function getStreams(file: string, stream: 'audio' | 'subtitle' | 'video'): string[] {
	const resp = execSync(
		`ffprobe -v error -select_streams ${stream[0]} -show_entries stream=index:stream_tags=language -of csv=p=0 "${file}"`,
		{encoding: 'utf-8', shell: 'cmd'});
	return !resp ? [] : resp.trim().split('\n').map(text => {
		const split = text.split(',');
		return !!split[1] ? split[1].trim() : 'unk'
	});
}
