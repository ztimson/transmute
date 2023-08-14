import {Component, forwardRef} from '@angular/core';
import {FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {Library} from '@transmute/common';
import {FormBoilerplateComponent} from '../../modules/form-helper';

@Component({
  	selector: 'tm-library-form',
  	templateUrl: './library-form.component.html',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => LibraryFormComponent),
		multi: true,
	}],
})
export class LibraryFormComponent extends FormBoilerplateComponent<Library> {
	constructor(fb: FormBuilder) {
		super(fb.group({
			name: ['', [Validators.required]],
			path: ['', [Validators.required]],
			watch: [true],
		}));
	}

	resetHook(preventDefault: () => void) { }

	validateHook(value: Library, preventDefault: () => void): void | boolean { }

	writeHook(value: Library, preventDefault: () => void): void { }
}
