import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Library, Metrics, Video} from '@transmute/common';
import {environment} from '../../environments/environment';
import {CrudApiClient} from '../modules/crud-api/client';
import {CrudApiEndpoint} from '../modules/crud-api/endpoint';

@Injectable({providedIn: 'root'})
export class LibraryEndpoint extends CrudApiEndpoint<number, Library> {
	constructor(protected http: HttpClient) {
		super(`${environment.apiUrl}/api/library/:id?`, 'id');
	}

	metrics(library?: number): Promise<Metrics> {
		return this.http.get<any>(`${this.getUrl({id: library})}/metrics`).toPromise();
	}

	scan(library?: number): Promise<{length: number}> {
		return this.http.get<any>(`${this.getUrl({id: library})}/scan`).toPromise();
	}

	videos(library?: number): Promise<Video[]> {
		return this.http.get<any>(`${this.getUrl({id: library})}/videos`).toPromise();
	}
}

@Injectable({providedIn: 'root'})
export class LibraryClient extends CrudApiClient<number, Library> {
	constructor(public api: LibraryEndpoint) { super(); }
}
