import { CrudDocument } from 'wacom';

export interface JobData {
	title: string;
	description: string;
	company: string;
	requirements: string[];
	status: 'active' | 'closed';
	preview: string;
}

export interface Job extends CrudDocument<Job> {
	data: JobData;
}
