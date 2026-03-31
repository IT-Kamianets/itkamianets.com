import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Service, ServiceCategory } from './service.interface';

export const SERVICE_IDS = ['it-kamianets', 'web-art-work'] as const;

@Injectable({
	providedIn: 'root',
})
export class ServiceService {
	private readonly _http = inject(HttpClient);

	private readonly _categories = signal<ServiceCategory[]>([]);
	categories = this._categories.asReadonly();

	private readonly _services = signal<Service[]>([]);
	services = this._services.asReadonly();

	constructor() {
		this._http.get<ServiceCategory[]>('/data/services.json').subscribe({
			next: (data) => {
				this._categories.set(data);
				const allServices = data.flatMap((c) => c.services);
				this._services.set(allServices);
			},
			error: (err) => console.error('Failed to load services', err),
		});
	}
}
