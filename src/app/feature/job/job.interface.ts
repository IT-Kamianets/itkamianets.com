import { CrudDocument } from 'wacom';

export interface Job extends CrudDocument<Job> {
	title: string;
	description: string;
	authorName: string;
	authorId?: string;
	published: boolean;
	preview: string;
}
