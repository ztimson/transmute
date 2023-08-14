import {Library} from '@transmute/common';
import {app, libraries} from '../main';
import {ErrorHandler} from '../middleware/error-handler.middleware';
import {CrudApiController} from '../modules/crud-api/controller';

export class LibraryController extends CrudApiController<number, Library>{
	protected readonly baseUrl = '/api/library';

	constructor() {
		super(libraries);

		// List all videos (must come before super)
		app.get(`${this.baseUrl}/videos`, ErrorHandler(async (req, res) =>
			res.json(await libraries.videos())));

		app.get(`${this.baseUrl}/scan`, ErrorHandler(async (req, res) =>
			res.json({length: await libraries.scanAll(true)})));

		// All stats (must come before super)
		app.get(`${this.baseUrl}/metrics`, ErrorHandler(async (req, res) =>
			res.json(await libraries.metrics())));

		// Library CRUD operations
		super.setup();

		// Scan library for videos
		app.get(`${this.baseUrl}/:id/scan`, ErrorHandler(async (req, res) => {
			res.json({length: await libraries.scan(Number(req.params['id']), true)})}));

		// Library stats
		app.get(`${this.baseUrl}/:id/metrics`, ErrorHandler(async (req, res) =>
			res.json(await libraries.metrics(Number(req.params['id'])))));

		// Library videos
		app.get(`${this.baseUrl}/:library/videos`, ErrorHandler(async (req, res) =>
			res.json(await libraries.videos(Number(req.params['library'])))));
	}
}
