import { Injectable, signal } from '@angular/core';
import { CrudDocument, CrudService } from 'wacom';
import { BUSINESSES } from '../../data/businesses.data';
import { Business } from './business.interface';

interface BusinessDoc extends CrudDocument<BusinessDoc> {
	name: string;
	description: string;
	data: Partial<Omit<Business, 'id' | 'name' | 'description'>>;
}

@Injectable({ providedIn: 'root' })
export class BusinessService extends CrudService<BusinessDoc> {
	readonly businesses = signal<Business[]>([]);

	private _businessDocs: BusinessDoc[] = [];

	constructor() {
		super({ name: 'regionitcompany', unauthorized: true });

		this.filteredDocuments(this._businessDocs, {
			filtered: () => {
				this.businesses.set(this._businessDocs.map((d) => this._fromDoc(d)));
			},
		});

		this.get().subscribe({
			next: (docs) => {
				console.log('[BusinessService] GET відповідь, кількість:', docs.length, docs);
				if (docs.length === 0) {
					this._seed();
				}
			},
			error: (err) => console.error('[BusinessService] GET помилка:', err),
		});
	}

	add(business: Omit<Business, 'id'>): void {
		this.create(this._toDoc(business)).subscribe({
			next: (doc) => console.log('[BusinessService] CREATE успіх, _id:', doc?._id),
			error: (err) => console.error('[BusinessService] CREATE помилка:', err),
		});
	}

	updateBusiness(business: Business): void {
		const doc = this._businessDocs.find((d) => d._id === business.id);
		if (!doc) return;
		doc.name = business.name;
		doc.description = business.description;
		doc.data = this._toData(business);
		super.update(doc).subscribe();
	}

	deleteBusiness(id: string): void {
		const doc = this._businessDocs.find((d) => d._id === id);
		if (!doc) return;
		super.delete(doc).subscribe();
	}

	private _fromDoc(doc: BusinessDoc): Business {
		return {
			id: doc._id ?? '',
			name: doc.name ?? '',
			description: doc.description ?? '',
			logo: doc.data?.logo ?? '',
			type: doc.data?.type ?? '',
			shortDescription: doc.data?.shortDescription ?? '',
			techStack: doc.data?.techStack ?? [],
			services: doc.data?.services ?? [],
			employees: doc.data?.employees ?? 0,
			founded: doc.data?.founded ?? new Date().getFullYear(),
			openPositions: doc.data?.openPositions,
			verified: doc.data?.verified,
			lat: doc.data?.lat,
			lng: doc.data?.lng,
			contacts: doc.data?.contacts ?? {},
		};
	}

	private _toDoc(business: Omit<Business, 'id'>): BusinessDoc {
		const { name, description, ...rest } = business;
		return { name, description, data: rest } as BusinessDoc;
	}

	private _toData(business: Business): Omit<Business, 'id' | 'name' | 'description'> {
		const { id, name, description, ...rest } = business;
		return rest;
	}

	private _seed(): void {
		console.log('[BusinessService] Запускаю сідінг...');
		for (const b of BUSINESSES) {
			const { id, ...rest } = b;
			this.create(this._toDoc(rest)).subscribe({
				next: (doc) => console.log('[BusinessService] SEED успіх:', b.name, '_id:', doc?._id),
				error: (err) => console.error('[BusinessService] SEED помилка:', b.name, err),
			});
		}
	}
}
