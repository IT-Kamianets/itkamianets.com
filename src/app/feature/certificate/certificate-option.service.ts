import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from '@wawjs/ngx-http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { CertificateOption } from './certificate-option.interface';

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
		return {
			data: {
				title: '',
				description: '',
				templateStyle: 'classic',
			},
		};
	}

	create(option: Partial<CertificateOption>): Observable<CertificateOption | null> {
		const data = option.data;
		const payload = {
			...option,
			data: {
				title: data?.title || '',
				description: data?.description || '',
				templateStyle: data?.templateStyle || 'classic',
			},
		};

		return this._http.post('/api/itcertificateoption/create', payload).pipe(
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
		const data = option.data;
		const payload = {
			_id: option._id,
			data: {
				title: data?.title || '',
				description: data?.description || '',
				templateStyle: data?.templateStyle || 'classic',
			},
		};

		return this._http.post('/api/itcertificateoption/update', payload).pipe(
			map((res: unknown) => (res ? (res as CertificateOption) : null)),
			tap((updatedOpt) => {
				if (updatedOpt) {
					this._options.update((opts) =>
						opts.map((option) => (option._id === updatedOpt._id ? updatedOpt : option)),
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
