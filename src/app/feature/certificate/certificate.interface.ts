import { CrudDocument } from 'wacom';

export interface Certificate extends CrudDocument<Certificate> {
	name?: string;
	description?: string;
	data?: Record<string, any>;
}
