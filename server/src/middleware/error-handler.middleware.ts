import {Logger} from '@transmute/common';
import {Request, Response} from 'express';
import {BadRequestError, CustomError, InternalServerError} from '../utils/errors';

const logger = new Logger('ErrorMiddleware');

export const ErrorHandler = fn => (req, res, next) => {
	return Promise
		.resolve(fn(req, res, next))
		.catch(next);
};

export const ErrorMiddleware = (err: Error | CustomError, req: Request, res: Response, next) => {
	const e: CustomError = CustomError.instanceof(err) ? err :
		err.stack.includes('SqliteError') ? BadRequestError.from(err) : InternalServerError.from(err);
	const code = (<any>e).constructor?.code;
	const userError = code >= 400 && code < 500;

	logger[userError ? 'verbose' : 'error'](userError ? `${code} ${err.message}` : err.stack);

	if(res) {
		res.status(code).json({
			code,
			message: err.message,
			stack: userError ? undefined : err.stack,
			timestamp: (new Date()).toISOString()
		})
	}
}
