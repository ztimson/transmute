import {
	ChangeDetectorRef,
	Component,
	Directive, ElementRef,
	Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef,
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {FormBoilerplateComponent} from '../form-boilerplate/form-boilerplate.component';

export type FormDialogBanner = {
	text?: string,
	cssClass?: string
};

export type FormDialogOptions<T extends object> = {
	addAnotherLabel?: string;
	banner?: FormDialogBanner;
	cancelLabel?: string;
	disableAddAnother?: boolean;
	form: FormBoilerplateComponent<T>;
	formArgs?: any;
	saveFn: FormDialogSaveFn<T>;
	saveLabel?: string;
	title?: string;
	value?: T | (() => T);
};

export type FormDialogSaveFn<T> = (value: T, closeFn: () => void, bannerFn: (text: string, cssClass?: string) => void) => void | Promise<void>;

@Directive({
	selector: '[addHost]',
})
export class AddHostDirective {
	constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
	selector: 'fh-form-dialog',
	templateUrl: './form-dialog.component.html'
})
export class FormDialogComponent<T extends Object, F extends FormBoilerplateComponent<T>> implements OnInit, OnDestroy {
	private subs: Subscription[] = [];

	anotherOne: boolean = false;
	banner: FormDialogBanner = {text: '', cssClass: ''}
	form!: FormBoilerplateComponent<T>;
	loading: boolean = false;

	@ViewChild(AddHostDirective, {static: true}) addHost!: AddHostDirective;
	@ViewChild(AddHostDirective, { read: ElementRef }) addHostEl!:ElementRef;

	constructor(private changeDetector: ChangeDetectorRef,
				private dialog: MatDialogRef<FormDialogComponent<T, F>>,
				@Inject(MAT_DIALOG_DATA) public readonly options: FormDialogOptions<T>
	) {
		Object.assign(this.options, {
			addAnotherLabel: 'Add Another',
			cancelLabel: 'Cancel',
			saveLabel: 'Save',
		}, this.options);
		this.setBanner(this.options.banner?.text, this.options.banner?.cssClass);
	}

	ngOnInit(): void {
		this.addHost.viewContainerRef.clear();
		this.form = <any>this.addHost.viewContainerRef.createComponent(<any>this.options.form).instance;
		if(this.options.formArgs) Object.assign(this.form, this.options.formArgs);
		if(this.options.value) {
			this.form.mode = 'edit';
			this.options.disableAddAnother = true;
			this.form.writeValue(
				typeof this.options.value == 'function'
					? this.options.value()
					: this.options.value
			);
		}
		this.subs.push(this.form.submit$.subscribe(() => this.save()));
	}

	ngOnDestroy() { this.subs = this.subs.filter(s => s.unsubscribe()); }

	save(): void {
		// TODO: connect form properties to dialog
		if(!this.form.value) return;
		this.loading = true;
		this.clearBanner();
		this.changeDetector.detectChanges();
		const value = this.form.value;
		const resp = this.options.saveFn(<any>value, () => {
			if(!this.anotherOne) {
				this.dialog.close(value);
			} else {
				this.clearBanner();
				this.form.reset();
				const control = <HTMLElement>document
					.querySelector('.fh-dialog-form [formcontrolname]:not(:disabled)');
				setTimeout(() => control.focus());
			}
		}, (text, cssClass) => this.setBanner(text, cssClass))
		if(resp instanceof Promise) {
			resp.finally(() => {
				this.loading = false;
				this.changeDetector.detectChanges();
			});
		} else {
			this.loading = false;
		}
	}

	clearBanner(): void { this.setBanner(); }
	setBanner(text?: string, cssClass: string = 'alert alert-danger') {
		this.banner = {text: text ?? '', cssClass};
	}
}
