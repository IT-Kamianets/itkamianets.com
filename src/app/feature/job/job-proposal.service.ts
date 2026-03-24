import { Injectable } from '@angular/core';
import { CrudService } from 'wacom';
import { JobProposal } from './job-proposal.interface';

@Injectable({
	providedIn: 'root',
})
export class JobProposalService extends CrudService<JobProposal> {
	constructor() {
		super({
			name: 'itjobproposal',
		});
	}
}
