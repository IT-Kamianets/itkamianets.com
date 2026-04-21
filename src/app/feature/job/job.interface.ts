<<<<<<< HEAD
<<<<<<< HEAD
import { CrudDocument } from 'wacom';
=======
import { CrudDocument } from '@wawjs/ngx-crud';
import { ItemOptions } from '../item/item.interface';
>>>>>>> 2afd0d29802756d20c45c43f0bfdb3d9dae8ae87

export interface JobData {
	title: string;
	description: string;
	company: string;
	requirements: string[];
	status: 'active' | 'closed';
	preview: string;
}
=======
import { CrudDocument } from 'wacom';
>>>>>>> 65460afd3fec1163b0ef7e3e41b73b8e6e58e66c

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
