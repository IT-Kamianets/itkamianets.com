export interface Quest {
	id: string;
	title: string;
	category: string;
	shortDescription: string;
	description: string;
	difficulty: string;
	reward: string;
	duration: string;
	format: string;
	active?: boolean;
	link?: string;
	curator?: string;
	location?: string;
}

export const QUEST_CATEGORIES = [
	'Освітній',
	'Технічний',
	'Командний',
	'Кар’єрний',
	'Творчий',
];

export const QUEST_DIFFICULTIES = ['Легкий', 'Середній', 'Складний'];
