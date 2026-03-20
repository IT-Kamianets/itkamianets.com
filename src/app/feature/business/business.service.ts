import { Injectable, signal } from '@angular/core';
import { BUSINESSES } from '../../data/businesses.data';
import { Business } from './business.interface';

@Injectable({ providedIn: 'root' })
export class BusinessService {
	readonly businesses = signal<Business[]>(BUSINESSES as Business[]);

	add(business: Omit<Business, 'id'>): void {
		const newBusiness: Business = {
			...business,
			id: business.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
		};
		this.businesses.update(businesses => [newBusiness, ...businesses]);
	}

	update(business: Business): void {
		this.businesses.update(businesses =>
			businesses.map(b => (b.id === business.id ? business : b))
		);
	}

	delete(id: string): void {
		this.businesses.update(businesses => businesses.filter(b => b.id !== id));
	}
}
