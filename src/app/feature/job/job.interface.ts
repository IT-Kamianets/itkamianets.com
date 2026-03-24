import { CrudDocument } from 'wacom';

export interface JobData {
	title: string;
	description: string;
	authorName: string;
	published: boolean;
	preview: string;
}

export interface Job extends CrudDocument<Job> {
	title: string;
	description: string;
	authorName: string;
	published: boolean;
	preview: string;
	data: JobData;
}
