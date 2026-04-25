import { CrudDocument } from '@wawjs/ngx-crud';

export interface CertificateOptionData {
	title: string;
	description: string;
	templateStyle: 'classic' | 'modern' | 'minimalist';
}

export interface CertificateOption extends CrudDocument<CertificateOption> {
	data?: CertificateOptionData;
}
