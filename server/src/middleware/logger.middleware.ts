import {Logger} from '@transmute/common';

const logger = new Logger('LoggerMiddleware');

export function LoggerMiddleware(req, res, next) {
	logger.verbose(`${req.method} ${decodeURI(req.url)}`);
	next();
}
