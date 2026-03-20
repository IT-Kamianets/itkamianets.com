export interface ServiceProvider {
	id: string;
	name: string;
	avatar: string;
	role: string;
	description?: string;
	rating?: number;
	completedProjects?: number;
}

export interface Service {
	id: string;
	title: string;
	shortDescription: string;
	fullDescription: string;
	category: string;
	image: string;
	features: string[];
	provider: ServiceProvider;
	priceFrom: number;
	currency: 'UAH' | 'USD' | 'EUR';
	timeFrom: number;
	timeTo: number;
	timeUnit: 'days' | 'weeks' | 'months';
}
