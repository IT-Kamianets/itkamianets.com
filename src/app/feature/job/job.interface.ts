import { CrudDocument } from '@wawjs/ngx-crud';
import { ItemOptions } from '../item/item.interface';

export interface Job extends CrudDocument<Job> {
	type?: 'job';
	options?: ItemOptions;
	title: string;
	description: string;
	authorName: string;
	authorId?: string;
	published: boolean;
	preview: string;
}
