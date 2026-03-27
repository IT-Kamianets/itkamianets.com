export const COMPANY_TYPES = ['Студія', 'Аутсорс', 'Продукт', 'Агентство', 'Ресторан', 'Кафе', 'Освіта', 'Медицина', 'Рітейл', 'Сервіс'] as const;

export type CompanyType = (typeof COMPANY_TYPES)[number];

export interface Company {
	id: string;
	name: string;
	logo: string;
	type: CompanyType;
	shortDescription: string;
	description: string;
	techStack: string[];
	services: string[];
	employees: number;
	founded: number;
	openPositions?: number;
	verified?: boolean;
	lat?: number;
	lng?: number;
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
