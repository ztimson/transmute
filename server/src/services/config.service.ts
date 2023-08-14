import {Config, ConfigDefaults, KeyVal} from '@transmute/common';
import {CrudApiService} from '../modules/crud-api/service';
import {BadRequestError} from '../utils/errors';

export class ConfigService extends CrudApiService<string, KeyVal> {
	readonly options: Partial<Config> = ConfigDefaults;

	constructor() {
		super('config', 'key', true);

		// Load config values
		(async () => {
			(await this.list()).forEach(({key, value}) => this.options[key] = value);
		})();
	}

	async afterRead(value: KeyVal, list: boolean): Promise<KeyVal> {
		value.value = JSON.parse(value.value);
		return value;
	}

	async beforeWrite(value: KeyVal, original: KeyVal): Promise<KeyVal> {
		if(value.key && this.options[value.key] === undefined)
			throw new BadRequestError(`Invalid config key: ${value.key}`);
		this.options[value.key] = value.value;
		value.value = JSON.stringify(value.value);
		return value;
	}

	afterWrite(value, original: | null): void { }

	async formatted(): Promise<Config> {
		return <Config>(await super.list())
			.reduce((acc, {key, value}) => ({...acc, [key]: value}), {});
	}
}
