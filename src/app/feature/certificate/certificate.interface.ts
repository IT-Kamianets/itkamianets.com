import { CrudDocument } from 'wacom';

export interface CertificateData {
	title: string;
	recipientName: string;
	description: string;
	issueDate: string;
	templateStyle: 'classic' | 'modern' | 'minimalist';
}

export interface Certificate extends CrudDocument<Certificate> {
	name?: string;
	description?: string;
	data?: CertificateData;
}
