import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Business } from './business.interface';

const API = `${environment.apiUrl}/api/itcompany`;

const STATIC_BUSINESSES: Business[] = [
	{
		id: 'static-1',
		name: 'WebArtWork',
		logo: '',
		type: 'Студія',
		shortDescription: 'Веб-студія повного циклу з Кам\'янця-Подільського',
		description: 'WebArtWork — команда досвідчених розробників, що створює сучасні веб-застосунки та цифрові продукти для бізнесу. Понад 10 років на ринку.',
		techStack: ['Angular', 'Node.js', 'MongoDB', 'TypeScript'],
		services: ['Веб-розробка', 'Мобільні застосунки', 'UI/UX дизайн', 'Технічна підтримка'],
		employees: 25,
		founded: 2013,
		openPositions: 2,
		verified: true,
		lat: 48.6726,
		lng: 26.5657,
		contacts: {
			website: 'https://webart.work',
			email: 'info@webart.work',
			telegram: 'https://t.me/webartwork',
		},
	},
	{
		id: 'static-empty',
		lat: 48.6700,
		lng: 26.5700,
		name: 'Мінімальна компанія',
		logo: '',
		type: 'Продукт',
		shortDescription: '',
		description: '',
		techStack: [],
		services: [],
		employees: 0,
		founded: 0,
		contacts: {},
	},
	{
		id: 'static-2',
		name: 'SoftCraft',
		lat: 48.6758,
		lng: 26.5612,
		logo: '',
		type: 'Аутсорс',
		shortDescription: 'Аутсорсингова IT-компанія, спеціалізація — фінтех та e-commerce',
		description: 'SoftCraft надає послуги аутсорсингової розробки для міжнародних клієнтів. Основні напрямки: фінансові технології, електронна комерція та корпоративні системи.',
		techStack: ['React', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
		services: ['Аутсорс розробка', 'Консалтинг', 'DevOps', 'QA тестування'],
		employees: 40,
		founded: 2017,
		openPositions: 5,
		verified: true,
		contacts: {
			website: 'https://softcraft.ua',
			email: 'hr@softcraft.ua',
			linkedin: 'https://linkedin.com/company/softcraft',
		},
	},
	...Array.from({ length: 13 }, (_, i) => ({
		id: `mock-${i + 1}`,
		name: `IT Компанія ${i + 1}`,
		logo: '',
		type: ['Студія', 'Аутсорс', 'Продукт', 'Агентство'][i % 4],
		shortDescription: `Короткий опис компанії ${i + 1}`,
		description: `Детальний опис компанії ${i + 1}`,
		techStack: ['Angular', 'Node.js', 'TypeScript'],
		services: ['Розробка', 'Консалтинг'],
		employees: 10 + i * 5,
		founded: 2010 + (i % 10),
		openPositions: i % 3,
		verified: i % 2 === 0,
		contacts: { website: `https://company${i + 1}.ua` },
	})),
];

@Injectable({ providedIn: 'root' })
export class BusinessService {
	private http = inject(HttpClient);
	private platformId = inject(PLATFORM_ID);

	readonly businesses = signal<Business[]>(STATIC_BUSINESSES);

	constructor() {
		if (isPlatformBrowser(this.platformId)) {
			this.http.get<any[]>(`${API}/get`).subscribe({
				next: (docs) => {
					if (Array.isArray(docs)) {
						this.businesses.set(docs.map((d) => this._fromDoc(d)));
					}
				},
			});
		}
	}

	add(business: Omit<Business, 'id'>): void {
		this.http.post<any>(`${API}/create`, this._toPayload(business)).subscribe({
			next: (doc) => {
				if (doc?._id) {
					this.businesses.update((list) => [this._fromDoc(doc), ...list]);
				} else {
					const id = crypto.randomUUID();
					this.businesses.update((list) => [{ ...business, id }, ...list]);
				}
			},
		});
	}

	updateBusiness(business: Business): void {
		this.http
			.post<any>(`${API}/update`, { _id: business.id, ...this._toPayload(business) })
			.subscribe({
				next: (doc) =>
					this.businesses.update((list) =>
						list.map((b) => (b.id === business.id ? (doc?._id ? this._fromDoc(doc) : business) : b)),
					),
			});
	}

	deleteBusiness(id: string): void {
		this.http.post<any>(`${API}/delete`, { _id: id }).subscribe({
			next: () => this.businesses.update((list) => list.filter((b) => b.id !== id)),
			error: () => this.businesses.update((list) => list.filter((b) => b.id !== id)),
		});
	}

	private _toPayload(business: Omit<Business, 'id'>) {
		const { name, shortDescription, ...rest } = business;
		return { name, description: shortDescription, data: rest };
	}

	private _fromDoc(doc: any): Business {
		return {
			id: doc._id,
			name: doc.name ?? '',
			shortDescription: doc.description ?? '',
			...(doc.data ?? {}),
		} as Business;
	}
}
