export class CustomError extends Error {
	static code = 500;

	constructor(message?: string) {
		super(message);
	}

	static from(err: Error) {
		const newErr = new this(err.message);
		return Object.assign(newErr, err);
	}

	static instanceof(err: Error) {
		return (<any>err).constructor.code != undefined;
	}
}

export class BadRequestError extends CustomError {
	static code = 400;

	constructor(message: string = 'Bad Request') {
		super(message);
	}

	static instanceof(err: Error) {
		return (<any>err).constructor.code == this.code;
	}
}


export class UnauthorizedError extends CustomError {
	static code = 401;

	constructor(message: string = 'Unauthorized') {
		super(message);
	}

	static instanceof(err: Error) {
		return (<any>err).constructor.code == this.code;
	}
}

export class ForbiddenError extends CustomError {
	static code = 403;

	constructor(message: string = 'Forbidden') {
		super(message);
	}

	static instanceof(err: Error) {
		return (<any>err).constructor.code == this.code;
	}
}

export class NotFoundError extends CustomError {
	static code = 404;

	constructor(message: string = 'Not Found') {
		super(message);
	}

	static instanceof(err: Error) {
		return (<any>err).constructor.code == this.code;
	}
}

export class InternalServerError extends CustomError {
	static code = 500;

	constructor(message: string = 'Internal Server Error') {
		super(message);
	}

	static instanceof(err: Error) {
		return (<any>err).constructor.code == this.code;
	}
}
