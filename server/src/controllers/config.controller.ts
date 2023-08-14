import {KeyVal} from '@transmute/common';
import {app, config} from '../main';
import {ErrorHandler} from '../middleware/error-handler.middleware';
import {CrudApiController} from '../modules/crud-api/controller';

export class ConfigController extends CrudApiController<string, KeyVal>{
	protected readonly baseUrl = '/api/config';

	constructor() {
		super(config);
		super.setup({
			update: true
		});

		// Fetch entire config
		app.get('/api/config', ErrorHandler(async (req, res) => {
			res.json(await config.formatted());
		}));
	}
}
