import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent, ConfirmDialogOptions} from '../components/confirm-dialog/confirm-dialog.component';
import {
	FormDialogComponent,
	FormDialogOptions,
	FormDialogSaveFn
} from '../components/form-dialog/form-dialog.component';

export type FormHelperConfirmDialogOptions =
	Omit<ConfirmDialogOptions, 'message' | 'title'> & {matDialog?: MatDialogConfig}

export type FormHelperOpenDialogOptions<T extends object> =
	Omit<FormDialogOptions<T>, 'form' | 'saveFn'> & {matDialog?: MatDialogConfig}

@Injectable()
export class FormHelperService {
	constructor(private dialog: MatDialog) { }

	confirm(title: string, message: string, options: FormHelperConfirmDialogOptions = {}): Promise<boolean> {
		return this.dialog.open(ConfirmDialogComponent, {
			autoFocus: false,
			disableClose: true,
			...options?.matDialog,
			data: {
				...options,
				title,
				message,
				matDialog: undefined
			}
		}).afterClosed().toPromise();
	}

	form<T extends object>(form: any, saveFn: FormDialogSaveFn<T>, options: FormHelperOpenDialogOptions<T> = {}): Promise<T | null> {
		return this.dialog.open(FormDialogComponent, {
			disableClose: true,
			...options?.matDialog,
			data: {
				...options,
				form,
				matDialog: undefined,
				saveFn,
			}
		}).afterClosed().toPromise();
	}
}
