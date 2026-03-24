import { CrudDocument } from 'wacom';

export interface JobProposal extends CrudDocument<JobProposal> {
	jobId: string;
	data: {
		applicantName: string;
		applicantEmail: string;
		applicantPhone: string;
		message: string;
		cvUrl?: string;
	};
}
