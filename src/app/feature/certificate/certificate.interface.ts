import { CrudDocument } from 'wacom';

export interface Certificate extends CrudDocument<Certificate> {
	data: Record<string, any>;
}
