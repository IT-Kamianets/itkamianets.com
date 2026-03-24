import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company } from './company.interface';

const API = `${environment.apiUrl}/api/itcompany`;

@Injectable({ providedIn: 'root' })
export class CompanyService {
	private http = inject(HttpClient);
	private platformId = inject(PLATFORM_ID);

	readonly company = signal<Company>(environment.company);
	readonly companies = signal<Company[]>([]);

	constructor() {
		if (isPlatformBrowser(this.platformId)) {
			this.http.get<any[]>(`${API}/get`).subscribe({
				next: (docs) => {
					if (Array.isArray(docs)) {
						this.companies.set(docs.map((d) => this._fromDoc(d)));
					}
				},
			});
		}
	}

	fetchById(id: string): Observable<Company | null> {
		return this.http.post<any>(`${API}/fetch`, { _id: id }).pipe(
			map((doc) => (doc?._id ? this._fromDoc(doc) : null)),
			catchError(() => of(null)),
		);
	}

	add(company: Omit<Company, 'id'>): void {
		this.http.post<any>(`${API}/create`, this._toPayload(company)).subscribe({
			next: (doc) => {
				if (doc?._id) {
					this.companies.update((list) => [this._fromDoc(doc), ...list]);
				} else {
					const id = crypto.randomUUID();
					this.companies.update((list) => [{ ...company, id }, ...list]);
				}
			},
		});
	}

	updateCompany(company: Company): void {
		this.http
			.post<any>(`${API}/update`, { _id: company.id, ...this._toPayload(company) })
			.subscribe({
				next: (doc) =>
					this.companies.update((list) =>
						list.map((c) => (c.id === company.id ? (doc?._id ? this._fromDoc(doc) : company) : c)),
					),
			});
	}

	deleteCompany(id: string): void {
		this.http.post<any>(`${API}/delete`, { _id: id }).subscribe({
			next: () => this.companies.update((list) => list.filter((c) => c.id !== id)),
			error: () => this.companies.update((list) => list.filter((c) => c.id !== id)),
		});
	}

	private _toPayload(company: Omit<Company, 'id'>) {
		const { name, shortDescription, ...rest } = company;
		return { name, description: shortDescription, data: rest };
	}

	private _fromDoc(doc: any): Company {
		return {
			id: doc._id,
			name: doc.name ?? '',
			shortDescription: doc.description ?? '',
			...(doc.data ?? {}),
		} as Company;
	}
}
