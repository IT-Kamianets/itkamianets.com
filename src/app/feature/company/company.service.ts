import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from 'wacom';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { COMPANY_TYPES, Company } from './company.interface';

const API = `/api/itcompany`;

@Injectable({ providedIn: 'root' })
export class CompanyService {
	private _http = inject(HttpService);

	readonly company = signal<Company>(environment.company);
	readonly companies = signal<Company[]>([]);

	constructor() {
		this._http.get(`${API}/get`).subscribe({
			next: (docs) => {
				if (Array.isArray(docs)) {
					this.companies.set(docs.map((d) => this._fromDoc(d)));
				}
			},
		});
	}

	fetchById(id: string): Observable<Company | null> {
		return this._http.post(`${API}/fetch`, { _id: id }).pipe(
			map((doc) => (doc?._id ? this._fromDoc(doc) : null)),
			catchError(() => of(null)),
		);
	}

	add(company: Omit<Company, 'id'>): void {
		this._http.post(`${API}/create`, this._toPayload(company)).subscribe({
			next: (doc) => {
				if (doc?._id) {
					this.companies.update((list) => [this._fromDoc(doc), ...list]);
				}
			},
		});
	}

	updateCompany(company: Company): void {
		const { id, ...rest } = company;
		this._http.post(`${API}/update`, { _id: id, ...this._toPayload(rest) }).subscribe({
			next: (doc) =>
				this.companies.update((list) =>
					list.map((c) =>
						c.id === company.id ? (doc?._id ? this._fromDoc(doc) : company) : c,
					),
				),
		});
	}

	deleteCompany(id: string): void {
		this._http.post(`${API}/delete`, { _id: id }).subscribe({
			next: () => this.companies.update((list) => list.filter((c) => c.id !== id)),
		});
	}

	private _toPayload(company: Omit<Company, 'id'>) {
		const { name, shortDescription, ...rest } = company;
		return { name, description: shortDescription, data: rest };
	}

	private _fromDoc(doc: any): Company {
		const rawData = typeof doc?.data === 'object' && doc.data !== null ? doc.data : {};
		const {
			id: _rawId,
			contacts: rawContacts,
			techStack: rawTechStack,
			services: rawServices,
			...restData
		} = rawData;
		const contacts = rawContacts ?? {};
		const techStack = rawTechStack ?? [];
		const services = rawServices ?? [];

		return {
			...restData,
			id: doc._id,
			name: doc.name ?? '',
			shortDescription: doc.description ?? '',
			logo: restData.logo ?? '',
			type: COMPANY_TYPES.includes(restData.type) ? restData.type : COMPANY_TYPES[0],
			employees: restData.employees ?? 0,
			founded: restData.founded ?? 0,
			description: restData.description ?? '',
			contacts,
			techStack,
			services,
		};
	}
}
