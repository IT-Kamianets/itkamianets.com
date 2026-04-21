export interface JobData {
	title: string;
	description: string;
	company: string;
	requirements: string[];
	status: 'active' | 'closed';
	preview: string;
}

export interface Job extends JobData {
	_id: string;
	data: JobData;
}
