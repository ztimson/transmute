import {db} from '../../services/sqlite.service';
import {NotFoundError} from '../../utils/errors';
import {whereBuilder} from '../../utils/sql.utils';

export abstract class CrudApiService<K, T> {
	protected constructor(protected readonly table: string, public readonly pk: keyof T, private autoCreate: boolean = false) {}

	abstract afterRead(value: T, list: boolean): Promise<T>;

	abstract beforeWrite(value: Partial<T>, original: T | null): Promise<T>;

	abstract afterWrite(value: T, original: T | null): void | Promise<void>;

	async list(filter?: Partial<T>, paginate?: {offset?: number, limit?: number}): Promise<T[]> {
		let qb = db.selectFrom(<any>this.table).selectAll();
		if(filter != null) qb = whereBuilder(qb, filter);
		return Promise.all((await qb.execute())
			// .filter((el, i) => !paginate || ((paginate?.offset == null || i >= paginate.offset) && (paginate?.limit == null || i < (paginate?.offset || 0) + paginate.limit)))
			.map((f: T) => this.afterRead(f, true)));
	}

	async create(value: Partial<T>): Promise<T> {
		const row = await db.insertInto(<any>this.table)
			.values(await this.beforeWrite(value, null))
			.returning(this.pk.toString())
			.executeTakeFirst();
		const newVal = await this.read((<any>row)[this.pk]);
		await this.afterWrite(newVal, null);
		return newVal;
	}

	async read(filter: K | Partial<T>): Promise<T> {
		const found = await whereBuilder(
			db.selectFrom(<any>this.table).selectAll(),
			typeof filter == 'object' ? filter : {[this.pk]: filter}
		).executeTakeFirst();
		if(!found) throw new NotFoundError();
		return this.afterRead(<T>found, false);
	}

	async update(value: Partial<T>): Promise<T> {
		const original = await this.read(<any>value[this.pk]);
		if(!original) {
			if(!this.autoCreate) throw new NotFoundError();
			return this.create(value);
		}
		return whereBuilder(
			db.updateTable(<any>this.table).set({...(await this.beforeWrite(value, original)), [this.pk]: undefined}),
			{[this.pk]: value[this.pk]}
		).execute().then(async () => {
			const newVal = await this.read(<any>value[this.pk]);
			await this.afterWrite(newVal, original);
			return newVal;
		});
	}

	async delete(filter?: K | Partial<T>): Promise<void> {
		return whereBuilder(
			db.deleteFrom(<any>this.table),
			typeof filter == 'object' ? filter : {[this.pk]: filter}
		).execute().then(() => {});
	}
}
