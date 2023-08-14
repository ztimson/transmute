import {includes} from '@transmute/common';
import {distinctUntilChanged, map, Observable, share} from 'rxjs';
import {ReactiveCache} from './reactiveCache';
import {CrudApiEndpoint} from './endpoint';

export abstract class CrudApiClient<K, T> {
	public abstract api: CrudApiEndpoint<K, T>;

	protected readonly cache = new ReactiveCache<K, T>();
	protected readonly groups = new ReactiveCache<Partial<T>, K[]>();
	protected readonly pending = new ReactiveCache<K | Partial<T>, Promise<T | T[]>>();

	clear() {
		this.cache.clear();
		this.groups.clear();
		this.pending.clear();
	}

	list(filter?: Partial<T>, reload?: boolean): Promise<T[]> {
		const ck = filter ?? {};
		if(!reload) {
			const cache = this.groups.get(ck);
			if(cache) return Promise.resolve(cache.map(k => <T>this.cache.get(k)));
			const pending = this.pending.get(ck);
			if(pending) return <Promise<T[]>>pending;
		}
		return <Promise<T[]>>this.pending.set(ck, this.api.list(filter).then(rows => {
			this.groups.set(ck, rows.map(r => {
				const pk = (<any>r)[this.api.pk.toString()];
				this.cache.set(pk, r);
				return pk;
			}));
			return rows;
		}).finally(() => this.pending.delete(ck)));
	}

	create(value: T): Promise<T> {
		return this.api.create(value).then(row => {
			const pk = (<any>row)[this.api.pk];
			this.cache.set(pk, row);
			this.groups.entries.forEach(([key, cached]) => {
				if(includes(row, key, true))
					this.groups.set(key, [...cached, pk]);
			});
			return row;
		});
	}

	read(filter: K | Partial<T>, reload?: boolean): Promise<T> {
		const pk = typeof filter == 'object' ? (<any>filter)[this.api.pk] : filter;
		if(!reload) {
			const cache = this.cache.get(pk);
			if(cache) return Promise.resolve(cache);
			const pending = this.pending.get(pk);
			if(pending) return <Promise<T>>pending;
		}
		return <Promise<T>>this.pending.set(filter, this.api.read(filter).then(row => {
			this.cache.set(pk, row);
			this.groups.entries.forEach(([key, cached]) => {
				if(includes(row, key, true))
					this.groups.set(key, [...cached, pk]);
			});
			return row;
		}).finally(() => this.pending.delete(pk)));
	}

	update(value: Partial<T>): Promise<T> {
		return this.api.update(value).then(row => {
			const pk = (<any>row)[this.api.pk];
			this.cache.set(pk, row);
			this.groups.entries.forEach(([key, cached]) => {
				if(includes(row, key, true))
					this.groups.set(key, [...cached, pk]);
			});
			return row;
		});
	}

	delete(filter: K | Partial<T>): Promise<void> {
		const pk = typeof filter == 'object' ? (<any>filter)[this.api.pk] : filter;
		return this.api.delete(filter).then(() => {
			this.cache.delete(pk);
			this.groups.entries.forEach(([key, cached]) => {
				this.groups.set(key, cached.filter(k => k != pk));
			});
		});
	}

	listen(filter?: K | Partial<T>): Observable<T[]> {
		const key: Partial<T> = <any>(filter == null ? {} : typeof filter == 'object' ? filter : {[this.api.pk]: filter});
		this.list(key);
		return this.cache.events.pipe(
			map(cached => cached.filter(c => includes(c, key))),
			distinctUntilChanged(),
			share()
		);
	}
}
