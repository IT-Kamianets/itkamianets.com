import { Injectable, computed } from '@angular/core';
import { CrudService } from 'wacom';
import { Certificate } from './certificate.interface';

@Injectable({
	providedIn: 'root',
})
export class CertificateService extends CrudService<Certificate> {
	constructor() {
		super({
			name: 'itcertificate',
		});
	}

	private _allSignals = this.getSignals('', undefined);

	readonly docs = computed(() => {
		return this._allSignals().map((sig) => sig());
	});
}
