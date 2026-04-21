import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from 'wacom';
import { Service, ServiceCategory } from './service.interface';

interface ServiceCategoryDoc {
	_id?: string;
	data?: Partial<ServiceCategory> & {
		type?: string;
	};
	name?: string;
	description?: string;
}

@Injectable({
	providedIn: 'root',
})
export class ServiceService {
	private readonly _http = inject(HttpService);

	private readonly _categories = signal<ServiceCategory[]>([]);
	categories = this._categories.asReadonly();

	private readonly _services = signal<Service[]>([]);
	services = this._services.asReadonly();

	constructor() {
		this._http.get('/api/ititem/get').subscribe({
			next: (response: unknown) => {
				const categories = this._mapCategories(response);
				this._categories.set(categories);
				this._services.set(categories.flatMap((category) => category.services));
			},
			error: (err) => {
				console.error('Failed to load services from API', err);
				this._categories.set([]);
				this._services.set([]);
			},
		});
	}

	private _mapCategories(response: unknown) {
		if (!Array.isArray(response)) {
			return [];
		}

		return response
			.map((doc) => this._mapCategory(doc as ServiceCategoryDoc))
			.filter((category): category is ServiceCategory => Boolean(category));
	}

	private _mapCategory(doc: ServiceCategoryDoc) {
		const data = doc.data || {};
		const services = Array.isArray(data.services) ? data.services : [];

		if (data.type !== 'service-category' || !services.length) {
			return null;
		}

		return {
			id: data.id || doc._id || '',
			name: data.name || doc.name || '',
			description: data.description || doc.description || '',
			services: services.filter((service): service is Service => Boolean(service?.id)),
		};
	}
}
