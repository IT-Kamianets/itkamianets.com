export interface JobProposalData {
	candidateName: string;
	email: string;
	phone?: string;
	cvUrl: string;
	message: string;
	jobId: string;
	status: 'new' | 'reviewed' | 'rejected';
}

export interface JobProposal extends JobProposalData {
	_id: string;
	data: JobProposalData;
}
