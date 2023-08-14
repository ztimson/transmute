import * as crypto from 'crypto';
import * as fs from 'fs';
import {join} from 'path';

/**
 * Calculate checksum of file
 *
 * @param {string} path Path to file
 * @returns {string} md5 checksum
 */
export function createChecksum(path: string): Promise<string> {
	return new Promise(function (res, rej) {
		const hash = crypto.createHash('md5');
		const input = fs.createReadStream(path);

		input.on('error', rej);
		input.on('data', (chunk) => hash.update(chunk));
		input.on('close', () => res(hash.digest('hex')));
	});
}

/**
 * Break apart a relative or absolute path to a file into it's individual parts
 *
 * @example
 * ```ts
 * console.log(parseFilename('/some/path/sample.mp4'));
 * // Output: {path: '/some/path/', fileName: 'sample.mp4', baseName: 'sample', extension: 'mp4'}
 * ```
 *
 * @param {string} file  Absolute or relative path to a file
 * @returns {{path: any, fileName: any, extension: any, baseName: any}} The components that makeup the given file path
 */
export function parseFilePath(file: string): {path: string, fileName: string, baseName: string, extension: string} {
	const matches: any = /^(?<path>.*?)(?<fileName>(?<baseName>[a-zA-Z0-9_\-\.\(\)\s]+)\.(?<extension>[a-zA-Z0-9]+))$/.exec(file);
	return {
		path: matches?.groups?.['path'],
		baseName: matches?.groups?.['baseName'],
		fileName: matches?.groups?.['fileName'],
		extension: matches?.groups?.['extension'],
	}
}

/**
 * Recursively search a directory for files
 *
 * @param {string} path Starting path
 * @returns {string[]} List of discovered files
 */
export function deepSearch(path: string): string[] {
	return fs.readdirSync(path).reduce((found, file) => {
		const filePath = join(path, file), isFile = fs.lstatSync(filePath).isFile();
		return [...found, ...(isFile ? [filePath] : deepSearch(filePath))];
	}, []);
}
