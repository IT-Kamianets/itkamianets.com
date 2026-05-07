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
	/** One-time price. 0 means free. */
	priceFrom: number;
	currency: 'UAH' | 'USD' | 'EUR';
	/** Monthly subscription fee, if any */
	subscriptionFee?: number;
	timeFrom: number;
	timeTo: number;
	timeUnit: 'days' | 'weeks' | 'months';
}

export interface ServiceCategory {
	id: string;
	name: string;
	description: string;
	services: Service[];
}
