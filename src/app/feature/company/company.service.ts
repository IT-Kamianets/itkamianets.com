import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { COMPANY_TYPES, Company } from './company.interface';

const API = `${environment.apiUrl}/api/itcompany`;

const FALLBACK_COMPANIES: Company[] = [
	{
		id: 'static-1',
		name: 'Bluebird Studio',
		logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80',
		type: 'Студія',
		shortDescription: 'Дизайн і розробка маркетингових сайтів для локального бізнесу та стартапів.',
		description:
			'Bluebird Studio працює з брендингом, лендингами, корпоративними сайтами та контентними платформами. Команда фокусується на швидкому запуску, чистому дизайні та зрозумілій адмінці для клієнтів.',
		techStack: ['Angular', 'Node.js', 'Tailwind CSS', 'Figma'],
		services: ['Landing pages', 'Corporate websites', 'UI/UX design', 'Content systems'],
		employees: 14,
		founded: 2019,
		openPositions: 2,
		verified: true,
		contacts: {
			website: 'https://example.com/bluebird',
			email: 'hello@bluebird.example',
			linkedin: 'https://linkedin.com/company/bluebird-studio',
			telegram: 'https://t.me/bluebirdstudio',
			address: 'Кам’янець-Подільський, центр',
		},
	},
	{
		id: 'static-2',
		name: 'FlowForge',
		logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80',
		type: 'Аутсорс',
		shortDescription: 'Продуктова та аутсорсингова веб-розробка для B2B SaaS-команд.',
		description:
			'FlowForge бере в роботу складні кабінети, внутрішні CRM-панелі, інтеграції та підтримку релізів. Команда добре закриває технічний discovery, аудит архітектури й прискорення delivery-процесів.',
		techStack: ['Angular', 'NestJS', 'PostgreSQL', 'Docker'],
		services: ['SaaS development', 'Technical audit', 'Admin panels', 'Support'],
		employees: 27,
		founded: 2017,
		openPositions: 1,
		verified: true,
		contacts: {
			website: 'https://example.com/flowforge',
			email: 'team@flowforge.example',
			linkedin: 'https://linkedin.com/company/flowforge',
			github: 'https://github.com/flowforge',
			address: 'Кам’янець-Подільський, технопарк',
		},
	},
	{
		id: 'mock-3',
		name: 'Analytica Hub',
		logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80',
		type: 'Продукт',
		shortDescription: 'Аналітичні інструменти для сервісних компаній, освітніх проєктів і міських ініціатив.',
		description:
			'Analytica Hub розробляє інструменти для аналізу поведінки користувачів, дашборди для менеджменту та сервіси пріоритизації беклогу. Команда сильна в структуризації продуктового discovery.',
		techStack: ['TypeScript', 'Python', 'PostHog', 'Supabase'],
		services: ['Analytics dashboards', 'Product discovery', 'Event tracking'],
		employees: 11,
		founded: 2021,
		openPositions: 0,
		verified: false,
		contacts: {
			website: 'https://example.com/analyticahub',
			email: 'contact@analyticahub.example',
			telegram: 'https://t.me/analyticahub',
			address: 'Кам’янець-Подільський, Старе місто',
		},
	},
	{
		id: 'mock-5',
		name: 'Support Lane',
		logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80',
		type: 'Сервіс',
		shortDescription: 'Підтримка digital-продуктів, контентних платформ та внутрішніх кабінетів.',
		description:
			'Support Lane допомагає командам, яким потрібні SLA, операційна підтримка після запуску, контроль якості звернень та прозорий процес ескалації інцидентів.',
		techStack: ['Zendesk', 'Intercom', 'Notion', 'TypeScript'],
		services: ['Product support', 'Incident handling', 'Release QA', 'Customer success'],
		employees: 18,
		founded: 2020,
		openPositions: 3,
		verified: false,
		contacts: {
			website: 'https://example.com/supportlane',
			email: 'support@supportlane.example',
			linkedin: 'https://linkedin.com/company/supportlane',
			address: 'Кам’янець-Подільський, Новий план',
		},
	},
	{
		id: 'mock-8',
		name: 'Motion Harbor',
		logo: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=300&q=80',
		type: 'Агентство',
		shortDescription: 'Креативна агенція для ребрендингу сервісів, запуску кампаній і дизайну цифрових продуктів.',
		description:
			'Motion Harbor поєднує бренд-стратегію, дизайн-системи, промосторінки та after-launch оптимізацію. Часто підхоплює проєкти на етапі, коли потрібен помітний візуальний ривок.',
		techStack: ['Webflow', 'Next.js', 'Framer', 'After Effects'],
		services: ['Brand refresh', 'Campaign websites', 'Design systems', 'Creative direction'],
		employees: 9,
		founded: 2022,
		openPositions: 1,
		verified: true,
		contacts: {
			website: 'https://example.com/motionharbor',
			email: 'hello@motionharbor.example',
			instagram: 'https://instagram.com/motionharbor',
			linkedin: 'https://linkedin.com/company/motionharbor',
			address: 'Кам’янець-Подільський, арт-квартал',
		},
	},
];

@Injectable({ providedIn: 'root' })
export class CompanyService {
	private _http = inject(HttpClient);

	readonly company = signal<Company>(environment.company);
	readonly companies = signal<Company[]>(this._getInitialCompanies());

	constructor() {
		this._http.get<any[]>(`${API}/get`).subscribe({
			next: (docs) => {
				if (Array.isArray(docs)) {
					const fetchedCompanies = docs.map((d) => this._fromDoc(d));
					this.companies.set(
						this._mergeCompanies([...this._getInitialCompanies(), ...fetchedCompanies]),
					);
				}
			},
			error: () => this.companies.set(this._getInitialCompanies()),
		});
	}

	fetchById(id: string): Observable<Company | null> {
		const localCompany = this.companies().find((company) => company.id === id) || null;

		return this._http.post<any>(`${API}/fetch`, { _id: id }).pipe(
			map((doc) => (doc?._id ? this._fromDoc(doc) : localCompany)),
			catchError(() => of(localCompany)),
		);
	}

	createLocalCompany(name: string) {
		const normalizedName = name.trim();
		if (!normalizedName) {
			return '';
		}

		const existingCompany = this.companies().find(
			(company) => company.name.toLowerCase() === normalizedName.toLowerCase(),
		);

		if (existingCompany) {
			return existingCompany.id;
		}

		const id = `local-${normalizedName
			.toLowerCase()
			.replace(/[^a-z0-9а-щьюяґєії-]+/gi, '-')
			.replace(/^-+|-+$/g, '')}-${Date.now()}`;

		this.companies.update((companies) => [
			{
				id,
				name: normalizedName,
				logo: '',
				type: 'Сервіс',
				shortDescription: 'Компанія додана вручну під час створення відгуку.',
				description:
					'Цю компанію додали вручну в адмінці відгуків. За потреби її можна пізніше доповнити в каталозі компаній.',
				techStack: [],
				services: ['Потребує уточнення'],
				employees: 0,
				founded: new Date().getFullYear(),
				verified: false,
				contacts: {},
			},
			...companies,
		]);

		return id;
	}

	add(company: Omit<Company, 'id'>): void {
		this._http.post<any>(`${API}/create`, this._toPayload(company)).subscribe({
			next: (doc) => {
				if (doc?._id) {
					this.companies.update((list) => [this._fromDoc(doc), ...list]);
				}
			},
		});
	}

	updateCompany(company: Company): void {
		const { id, ...rest } = company;
		this._http
			.post<any>(`${API}/update`, { _id: id, ...this._toPayload(rest) })
			.subscribe({
				next: (doc) =>
					this.companies.update((list) =>
						list.map((c) => (c.id === company.id ? (doc?._id ? this._fromDoc(doc) : company) : c)),
					),
			});
	}

	deleteCompany(id: string): void {
		this._http.post<any>(`${API}/delete`, { _id: id }).subscribe({
			next: () => this.companies.update((list) => list.filter((c) => c.id !== id)),
		});
	}

	private _getInitialCompanies() {
		const envCompany = environment.company?.id ? [environment.company] : [];

		return this._mergeCompanies([...envCompany, ...FALLBACK_COMPANIES]);
	}

	private _mergeCompanies(companies: Company[]) {
		const deduplicated = new Map<string, Company>();

		for (const company of companies) {
			if (company?.id) {
				deduplicated.set(company.id, company);
			}
		}

		return [...deduplicated.values()];
	}

	private _toPayload(company: Omit<Company, 'id'>) {
		const { name, shortDescription, ...rest } = company;
		return { name, description: shortDescription, data: rest };
	}

	private _fromDoc(doc: any): Company {
		const rawData = typeof doc?.data === 'object' && doc.data !== null ? doc.data : {};
		const { id: _rawId, contacts: rawContacts, techStack: rawTechStack, services: rawServices, ...restData } = rawData;
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
