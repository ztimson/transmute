import {HttpClient} from '@angular/common/http';

export abstract class CrudApiEndpoint<K, T> {
	protected abstract http: HttpClient;

	getUrl!: (value?: K | Partial<T>) => string;

	protected constructor(private readonly url: string, public readonly pk: keyof T) {
		const parts = url.split('/');
		if(url.indexOf('://') != -1) {
			const protocol = parts.splice(0, 2)[0];
			parts[0] = `${protocol}//${parts[0]}`;
		}

		this.getUrl = (value?: K | Partial<T>) => {
			if(value == null) value = {};
			if(typeof value != 'object') value = <Partial<T>>{[this.pk]: value};
			let last: number;
			let newUrl: string = parts.map((p, i) => {
				if(p[0] != ':') return p;
				last = i;
				const optional = p.slice(-1) == '?';
				const key = p.slice(1, optional ? -1 : undefined);
				const val = (<any>value)?.[key];
				if(val == undefined && !optional)
					throw new Error(`'The request to "${url}" is missing the following key: ${key}\n\n${JSON.stringify(value)}`);
				return val;
			}).filter((p, i) => !!p || i > last).join('/');
			return newUrl;
		};
	}

	list(filter?: Partial<T>, paginate?: { offset?: number; limit?: number }): Promise<T[]> {
		return <any>this.http.get<T[]>(this.getUrl(filter), {params: paginate}).toPromise();
	}

	create(value: T): Promise<T> {
		return <any>this.http.post<T>(this.getUrl(value), value).toPromise();
	}

	read(filter: K | Partial<T>): Promise<T> {
		return <any>this.http.get<T>(this.getUrl(filter)).toPromise();
	}

	update(value: Partial<T>): Promise<T> {
		return <any>this.http.patch<T>(this.getUrl(value), value).toPromise();
	}

	delete(filter: K | Partial<T>): Promise<void> {
		return this.http.delete<void>(this.getUrl(filter)).toPromise();
	}
}
