import { Injectable, computed } from '@angular/core';
import { CrudService } from 'wacom';
import { Job } from './job.interface';

@Injectable({
	providedIn: 'root',
})
export class JobService extends CrudService<Job> {
	constructor() {
		super({
			name: 'job',
		});
	}

	private _docsSignals = this.getSignals('', undefined);

	readonly docs = computed(() => {
		return this._docsSignals().map((sig) => sig());
	});
}
