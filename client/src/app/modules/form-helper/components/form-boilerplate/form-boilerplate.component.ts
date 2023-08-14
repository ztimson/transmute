import {
	Component,
	EventEmitter,
  HostListener,
	Input,
	Output,
} from '@angular/core';
import {ControlValueAccessor, FormGroup} from '@angular/forms';
import {deepCopy, isEqual} from '@transmute/common';

@Component({template: ''})
export abstract class FormBoilerplateComponent<T extends Object> implements ControlValueAccessor {
	private original?: T;
	value?: T;

	private _changes: any = () => {};
	registerOnChange(fn: any): void { this._changes = fn; }

	private _touched: any = () => {};
	registerOnTouched(fn: any): void { this._touched = fn; }

	@Input() disabled?: boolean;
	@Input() mode: 'new' | 'edit' = 'new';

	@Output() submit$ = new EventEmitter<void>();
	@Output() reset$ = new EventEmitter<void>();

	protected constructor(public readonly form: FormGroup) {
		this.form.valueChanges.subscribe(value => {
			this.value = {...this.value, ...value}
			this._changes(this.value);
		})
	}

	protected abstract resetHook(preventDefault: () => void): void;
	protected abstract writeHook(value: T, preventDefault: () => void): void;
	protected abstract validateHook(value: T, preventDefault: () => void): void | boolean;

	@HostListener('document:keyup.enter')
	private submit() { this.submit$.emit(); }

	getError(control: string): {key: string, args: any} | null {
		const c = this.form.get(control);
		if(!!c?.errors) {
			const key = Object.keys(c.errors)[0];
			return {key, args: c.errors[key]};
		}
		return null;
	}

	getValue(control: string): any {
		return this.form.get(control) || (<any>this.value)[control];
	}

	reset() {
		let preventDefault = false;
		this.resetHook(() => preventDefault = true);
		if(preventDefault) return;

		this.form.reset();
		this.value = this.original ?? undefined;
		if(this.original) this.form.setValue(this.original);
		this.reset$.emit();
	}

	setDisabledState?(disabled: boolean): void {
		this.disabled = disabled;
		this.disabled ? this.form.disable() : this.form.enable();
	}

	writeValue(value: Partial<T>): void {
		if(this.disabled || isEqual(this.value, {...(this.value ?? {}), ...value})) return;
		if(!this.original) {
			this.original = <T>(deepCopy(value) || {});
			Object.keys(this.form.controls).forEach((key: string) => {
				if(this.original && (<any>this.original)[key] == undefined)
          			(<any>this.original)[key] = null;
			});
		}
		this.value = {...(this.value ?? this.original), ...value};
		let preventDefault = false;
		this.writeHook(this.value, () => preventDefault = true);
		if(preventDefault) return;
		this.form.patchValue(this.value);
	}
}
