import { CrudDocument } from '@wawjs/ngx-crud';

export interface User extends CrudDocument<User> {
	data: Record<string, unknown>;
	is: Record<string, boolean>;
	roles: string[];
	name: string;
	phone: string;
	bio: string;
	email: string;
	thumb: string;
	token?: string;
}
