export interface JobData {
	title: string;
	description: string;
	company: string;
	requirements: string[];
	status: 'active' | 'closed';
	preview: string;
	published?: boolean;
	authorName?: string;
	authorId?: string;
}

export interface Job extends JobData {
	_id: string;
	data: JobData;
}
