export const CliEffects = {
	CLEAR: "\x1b[0m",
	BRIGHT: "\x1b[1m",
	DIM: "\x1b[2m",
	UNDERSCORE: "\x1b[4m",
	BLINK: "\x1b[5m",
	REVERSE: "\x1b[7m",
	HIDDEN: "\x1b[8m",
}

export const CliForeground = {
	BLACK: "\x1b[30m",
	RED: "\x1b[31m",
	GREEN: "\x1b[32m",
	YELLOW: "\x1b[33m",
	BLUE: "\x1b[34m",
	MAGENTA: "\x1b[35m",
	CYAN: "\x1b[36m",
	WHITE: "\x1b[37m",
	GREY: "\x1b[90m",
}

export const CliBackground = {
	BLACK: "\x1b[40m",
	RED: "\x1b[41m",
	GREEN: "\x1b[42m",
	YELLOW: "\x1b[43m",
	BLUE: "\x1b[44m",
	MAGENTA: "\x1b[45m",
	CYAN: "\x1b[46m",
	WHITE: "\x1b[47m",
	GREY: "\x1b[100m",
}

export class Logger {
	constructor(public readonly namespace: string) { }

	private format(...text: string[]): string {
		return `${new Date().toISOString()} [${this.namespace}] ${text.join(' ')}`;
	}

	debug(...args: string[]) {
		console.log(CliForeground.MAGENTA + this.format(...args) + CliEffects.CLEAR);
	}

	error(...args: string[]) {
		console.log(CliForeground.RED + this.format(...args) + CliEffects.CLEAR);
	}

	info(...args: string[]) {
		console.log(CliForeground.CYAN + this.format(...args) + CliEffects.CLEAR);
	}

	log(...args: string[]) {
		console.log(CliEffects.CLEAR + this.format(...args));
	}

	warn(...args: string[]) {
		console.log(CliForeground.YELLOW + this.format(...args) + CliEffects.CLEAR);
	}

	verbose(...args: string[]) {
		console.log(CliForeground.WHITE + this.format(...args) + CliEffects.CLEAR);
	}
}
