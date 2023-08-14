import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgChartsModule} from 'ng2-charts';
import {LibraryFormComponent} from './components/library-form/library-form.component';
import {LibrarySelectorComponent} from './components/library-selector/library-selector.component';
import {PiechartComponent} from './components/piechart/piechart.component';
import {SettingsFormComponent} from './components/settings-form/settings-form.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {FormHelperModule} from './modules/form-helper';
import {SizePipe} from './pipes/size.pipe';

import {AppComponent} from './views/app.component';
import {MaterialModule} from './modules/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
	declarations: [
		AppComponent,
		LibraryFormComponent,
		LibrarySelectorComponent,
		PiechartComponent,
		SettingsFormComponent,
		SizePipe,
		ToolbarComponent,
	],
	imports: [
		BrowserModule.withServerTransition({appId: 'serverApp'}),
		BrowserAnimationsModule,
		FormHelperModule,
		FormsModule,
		HttpClientModule,
		MaterialModule,
		NgChartsModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
