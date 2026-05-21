import { CrudDocument } from '@wawjs/ngx-crud';

export interface Achievement extends CrudDocument<Achievement> {
	name: string;
	description?: string;
	data?: Record<string, unknown>;
}
