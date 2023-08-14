import {app} from '../../main';
import {ErrorHandler} from '../../middleware/error-handler.middleware';
import {CrudApiService} from './service';

export abstract class CrudApiController<K, T> {
	protected readonly baseUrl: string;

	protected constructor(private service: CrudApiService<K, T>) { }

	setup(methods?: {list?: boolean, read?: boolean, create?: boolean, update?: boolean, delete?: boolean}): void {
		if(!methods || methods?.create)
			app.post(this.baseUrl, ErrorHandler(async (req, res) => {
				res.json(await this.service.create(req.body));
			}));

		if(!methods || methods?.list)
			app.get(this.baseUrl, ErrorHandler(async (req, res) => {
				const pagination = {offset: Number(req.query['offset']), limit: Number(req.query['limit'])}
				res.json(await this.service.list(Object.keys(req.params).length > 0 ? <Partial<T>>req.params : undefined, pagination));
			}));

		if(!methods || methods?.read)
			app.get(`${this.baseUrl}/:${this.service.pk.toString()}`, ErrorHandler(async (req, res) => {
				res.json(await this.service.read(<K>req.params[this.service.pk]));
			}));

		if(!methods || methods?.update)
			app.patch(`${this.baseUrl}/:id?`, ErrorHandler(async (req, res) => {
				res.json(await this.service.update(req.body));
			}));

		if(!methods || methods?.delete)
			app.delete(`${this.baseUrl}/:${this.service.pk.toString()}`, ErrorHandler(async (req, res) => {
				res.json(await this.service.delete(<K>req.params[this.service.pk]));
			}));
	}
}
