export interface Business {
	id: string;
	name: string;
	logo: string;
	type: 'Студія' | 'Аутсорс' | 'Продукт' | 'Агентство';
	shortDescription: string;
	description: string;
	techStack: string[];
	services: string[];
	employees: number;
	founded: number;
	openPositions?: number;
	verified?: boolean;
	contacts: {
		website?: string;
		email?: string;
		linkedin?: string;
		telegram?: string;
		github?: string;
		twitter?: string;
		facebook?: string;
		instagram?: string;
		address?: string;
	};
}

export const BUSINESS_TYPES = ['Студія', 'Аутсорс', 'Продукт', 'Агентство'];
