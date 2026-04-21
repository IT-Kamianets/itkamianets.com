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

export interface Job extends CrudDocument<Job> {
	data: JobData;
}
