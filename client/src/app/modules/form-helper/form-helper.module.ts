import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {AddHostDirective, FormDialogComponent} from './components/form-dialog/form-dialog.component';
import {FormHelperService} from './services/form-helper.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDialogModule,
		MatIconModule
	],
	declarations: [
		AddHostDirective,
		ConfirmDialogComponent,
		FormDialogComponent
	],
	providers: [FormHelperService],
	exports: [
		ConfirmDialogComponent,
		FormDialogComponent
	]
})
export class FormHelperModule { }
