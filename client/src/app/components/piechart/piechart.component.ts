import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
	selector: 'tm-pichart',
	templateUrl: './piechart.component.html'
})
export class PiechartComponent implements OnChanges {
	@Input() data!: {[key: string]: number};
	@Input() title?: string;

	dataset!: {labels: string[], datasets: {data: number[]}[]};
	options: any = {
		plugins: {
			legend: {position: 'bottom'}
		}
	};

	ngOnChanges(changes: SimpleChanges) {
		if(changes['title']) this.options.plugins.title = {text: this.title};
		if(changes['data']) {
			const labels: string[] = [], data: number[] = [];
			Object.entries(this.data).forEach(([key, value]) => {
				labels.push(key);
				data.push(value);
			});
			this.dataset = {labels, datasets: [{data}]};
		}
	}
}
