export interface JobProposal {
	_id: string;
	candidateName: string;
	email: string;
	phone?: string;
	cvUrl: string;
	message: string;
	jobId: string;
	status: 'new' | 'reviewed' | 'rejected';
}
