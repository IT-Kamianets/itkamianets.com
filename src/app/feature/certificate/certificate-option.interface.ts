import { CrudDocument } from 'wacom';

export interface CertificateOption extends CrudDocument<CertificateOption> {
	data: Record<string, any>;
}
