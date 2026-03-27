import { CrudDocument } from 'wacom';

export interface JobProposalData {
	candidateName: string;
	email: string;
	cvUrl: string;
	jobId: string;
	status: 'new' | 'reviewed' | 'rejected';
}

export interface JobProposal extends CrudDocument<JobProposal> {
	data: JobProposalData;
}
