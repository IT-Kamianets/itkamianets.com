import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from 'wacom';
import { CertificateOption } from './certificate-option.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CertificateOptionService {
	private readonly _http = inject(HttpService);

	private readonly _options = signal<CertificateOption[]>([]);
	readonly docs = this._options.asReadonly();

	getAll(): Observable<CertificateOption[]> {
		return this._http.get('/api/itcertificateoption/get').pipe(
			map((response: unknown) => {
				const items = Array.isArray(response) ? (response as CertificateOption[]) : [];
				this._options.set(items);
				return items;
			}),
			catchError(() => of([])),
		);
	}

	new(): Partial<CertificateOption> {
		return { data: {} };
	}

	create(option: Partial<CertificateOption>): Observable<CertificateOption | null> {
		return this._http.post('/api/itcertificateoption/create', option).pipe(
			map((res: unknown) => (res ? (res as CertificateOption) : null)),
			tap((newOpt) => {
				if (newOpt) {
					this._options.update((opts) => [...opts, newOpt]);
				}
			}),
			catchError(() => of(null)),
		);
	}

	update(option: CertificateOption): Observable<CertificateOption | null> {
		return this._http
			.post('/api/itcertificateoption/update', {
				_id: option._id,
				data: option.data,
			})
			.pipe(
				map((res: unknown) => (res ? (res as CertificateOption) : null)),
				tap((updatedOpt) => {
					if (updatedOpt) {
						this._options.update((opts) =>
							opts.map((item) => (item._id === updatedOpt._id ? updatedOpt : item)),
						);
					}
				}),
				catchError(() => of(null)),
			);
	}

	delete(option: CertificateOption): Observable<boolean> {
		return this._http.post('/api/itcertificateoption/delete', { _id: option._id }).pipe(
			map((res: unknown) => !!res),
			tap((success) => {
				if (success) {
					this._options.update((opts) => opts.filter((item) => item._id !== option._id));
				}
			}),
			catchError(() => of(false)),
		);
	}
}
