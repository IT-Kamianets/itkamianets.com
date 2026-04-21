import { Injectable, computed } from '@angular/core';
import { CrudService } from 'wacom';
import { Job } from './job.interface';

@Injectable({
	providedIn: 'root',
})
export class JobService extends CrudService<Job> {
	constructor() {
		super({
			name: 'item',
		});
	}

	private _allSignals = this.getSignals('', undefined);

	readonly docs = computed(() => {
		return this._allSignals()
			.map((sig) => sig())
			.filter((doc: any) => doc.type === 'job');
	});

	override create(job: Job) {
		(job as any).type = 'job';
		return super.create(job);
	}
}
