import {Component, forwardRef} from '@angular/core';
import {FormBuilder, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AudioCodec, Config, Container, VideoCodec} from '@transmute/common';
import {FormBoilerplateComponent} from '../../modules/form-helper';

@Component({
	selector: 'tm-settings-form',
	templateUrl: './settings-form.component.html',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SettingsFormComponent),
		multi: true,
	}],
})
export class SettingsFormComponent extends FormBoilerplateComponent<Config> {
	containers = Object.entries(Container);
	videoCodecs = Object.entries(VideoCodec);
	audioCodecs = Object.entries(AudioCodec);
	audioFilter = false;
	sizeCutoff = false;
	subFilter = false;

	constructor(fb: FormBuilder) {
		super(fb.group({
			priority: ['', []],
			healthcheck: ['', []],
			deleteUnhealthy: [false, []],
			healthyOnly: [false, []],
			deleteOriginal: [false, []],
			targetContainer: ['', []],
			targetVideoCodec: ['', []],
			targetAudioCodec: ['', []],
			singleAudioTrack: [false, []],
			audioTracks: [[], []],
			subTracks: [[], []],
		}));

		this.form.controls['deleteUnhealthy'].disable();
		this.form.controls['healthyOnly'].disable();
		this.form.controls['healthcheck'].valueChanges.subscribe(v => {
			this.form.controls['deleteUnhealthy'][!!v ? 'enable' : 'disable']();
			this.form.controls['healthyOnly'][!!v ? 'enable' : 'disable']();
			if(!v) this.writeValue({deleteUnhealthy: false, onlyTranscodeHealthy: false});
		});
	}

	resetHook(preventDefault: () => void) { }

	validateHook(value: Config, preventDefault: () => void): void | boolean { }

	writeHook(value: Config, preventDefault: () => void): void { }
}
