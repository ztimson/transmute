import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export type ConfirmDialogOptions = {
	cancelLabel?: string;
	confirmLabel?: string;
	title?: string;
	message: string;
};

@Component({
	selector: 'fh-confirm-dialog',
	templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public readonly options: ConfirmDialogOptions) {
		Object.assign(this.options, {
			cancelLabel: 'Cancel',
			confirmLabel: 'Ok',
		}, this.options);
	}
}
