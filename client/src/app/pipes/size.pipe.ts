import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'size'})
export class SizePipe implements PipeTransform {
	transform(size: number = 0) {
		const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
		let i = 0;
		while(size / (1024 ** i) > 1024) i++;
		return `${Number((size / (1024 ** i)).toFixed(1))} ${units[i]}`;
	}
}
