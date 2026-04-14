import { CrudDocument } from 'wacom';

export interface Job extends CrudDocument<Job> {
	title: string;
	description: string;
	requirements: string[];
	status: 'active' | 'closed';
	authorName: string;
	authorId: string;
	published: boolean;
	preview: string;
	company: string;
}
