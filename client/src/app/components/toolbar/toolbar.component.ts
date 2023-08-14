import {Component} from '@angular/core';
import {FormHelperService} from '../../modules/form-helper/services/form-helper.service';
import {SettingsFormComponent} from '../settings-form/settings-form.component';

@Component({
	selector: 'tm-toolbar',
	templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {
	constructor(private fh: FormHelperService) {}


	settings() {
		this.fh.form(SettingsFormComponent, (config, close, banner) => {
			console.log(config);
			close();
		}, {disableAddAnother: true, matDialog: {width: 'min(100%, 600px)'}});
	}
}
