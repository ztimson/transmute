import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Job, Library, Metrics, Video} from '@transmute/common';
import {LibraryClient} from '../services/library.service';

export type Node = {
	name: string;
	job: Job | null
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	library?: Library;
	metrics?: Metrics;
	nodes: Node[] = [
		{name: 'manager-1', job: null},
		{name: 'Node-2', job: null}
	];
	videos: Video[] = [];

	constructor(private dialog: MatDialog,
				private libraryApi: LibraryClient,
				private changeRef: ChangeDetectorRef
	) { }

	async ngOnInit() {
		this.librarySelected();
	}

	librarySelected(library?: Library) {
		Promise.all([
			this.libraryApi.api.videos(library?.id).then(videos => this.videos = videos),
			this.libraryApi.api.metrics(library?.id).then((m: any) => this.metrics = m)
		]).then(() => this.changeRef.detectChanges());
	}

	list(arr?: string[]): string {
		return !!arr ? arr.join(', ') : '';
	}
}
