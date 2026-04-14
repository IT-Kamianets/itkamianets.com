import { CrudDocument } from 'wacom';

export interface JobProposal extends CrudDocument<JobProposal> {
	candidateName: string;
	email: string;
	phone?: string;
	cvUrl: string;
	message: string;
	jobId: string;
	status: 'new' | 'reviewed' | 'rejected';
}
