import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Library} from '@transmute/common';
import {FormHelperService} from '../../modules/form-helper/services/form-helper.service';
import {LibraryClient} from '../../services/library.service';
import {LibraryFormComponent} from '../library-form/library-form.component';

@Component({
	selector: 'tm-library-selector',
	templateUrl: './library-selector.component.html'
})
export class LibrarySelectorComponent implements OnChanges {
	libraries: Library[] = [];

	@Input() selected?: Library | '';
	@Output() selectedChange = new EventEmitter();

	constructor(private fh: FormHelperService,
				private libraryApi: LibraryClient
	) {
		this.libraryApi.listen().subscribe(l => this.libraries = l);
	}

	ngOnChanges(changes: SimpleChanges) {
		if(changes['selected'] && !this.selected) this.selected = <any>'';
	}

	async delete(library: Library) {
		if(!(await this.fh.confirm('Delete',
			`Are you sure you want to delete: ${library.name}`
		))) return;
		await this.libraryApi.delete(library);
		this.selectionChanged(null);
	}

	edit(library?: Library) {
		console.log(library);
		this.fh.form<Library>(LibraryFormComponent, (value, close, banner) => {
			if(!value) return;
			const create = value['id'] == undefined;
			this.libraryApi[create ? 'create' : 'update'](value).then(saved => {
				const exists = this.libraries.findIndex(l => l.id == saved.id);
				if(exists == -1) this.libraries.push(saved);
				else this.libraries.splice(exists, 1, saved);
				this.selectionChanged(saved);
				close();
			}).catch(resp => banner(resp.error.message));
		}, {
			title: `${library ? 'Edit' : 'New'} Library`,
			value: library
		});
	}

	scan(library: Library | null) {
		this.libraryApi.api.scan(library?.id);
	}

	selectionChanged(library: Library | null) {
		this.selected = library || '';
		this.selectedChange.emit(library);
	}
}
