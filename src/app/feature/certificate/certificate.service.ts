import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from 'wacom';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Certificate } from './certificate.interface';

@Injectable({
	providedIn: 'root',
})
export class CertificateService {
	private readonly _http = inject(HttpService);
	
	private readonly _certificates = signal<Certificate[]>([]);
	readonly docs = this._certificates.asReadonly();

	constructor() {
		this.getAll().subscribe();
	}

	getAll(): Observable<Certificate[]> {
		return this._http.get('/api/itcertificate/get').pipe(
			map((response: unknown) => {
				const items = Array.isArray(response) ? (response as Certificate[]) : [];
				this._certificates.set(items);
				return items;
			}),
			catchError(() => of([]))
		);
	}

	fetchOne(id: string): Observable<Certificate | null> {
		return this._http.post('/api/itcertificate/fetch', { _id: id }).pipe(
			map((item: unknown) => item ? (item as Certificate) : null),
			catchError(() => of(null))
		);
	}

	new(): Partial<Certificate> {
		return { data: {} };
	}

	create(cert: Partial<Certificate>): Observable<Certificate | null> {
		const payload = {
			...cert,
			name: cert.data?.['recipientName'] || '',
			description: cert.data?.['title'] || ''
		};
		return this._http.post('/api/itcertificate/create', payload).pipe(
			map((res: unknown) => res ? (res as Certificate) : null),
			tap(newCert => {
				if (newCert) {
					this._certificates.update(certs => [...certs, newCert]);
				}
			}),
			catchError(() => of(null))
		);
	}

	update(cert: Certificate): Observable<Certificate | null> {
		const payload = {
			_id: cert._id,
			name: cert.data?.['recipientName'] || '',
			description: cert.data?.['title'] || '',
			data: cert.data
		};
		return this._http.post('/api/itcertificate/update', payload).pipe(
			map((res: unknown) => res ? (res as Certificate) : null),
			tap(updatedCert => {
				if (updatedCert) {
					this._certificates.update(certs => certs.map(c => c._id === updatedCert._id ? updatedCert : c));
				}
			}),
			catchError(() => of(null))
		);
	}

	delete(cert: Certificate): Observable<boolean> {
		return this._http.post('/api/itcertificate/delete', { _id: cert._id }).pipe(
			map(() => true),
			tap(success => {
				if (success) {
					this._certificates.update(certs => certs.filter(c => c._id !== cert._id));
				}
			}),
			catchError(() => of(false))
		);
	}
}
