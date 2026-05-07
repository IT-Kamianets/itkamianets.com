export interface QuestData {
	title?: string;
	name?: string;
	category?: string;
	type?: string;
	shortDescription?: string;
	summary?: string;
	description?: string;
	about?: string;
	difficulty?: string;
	level?: string;
	reward?: string;
	prize?: string;
	duration?: string;
	format?: string;
	active?: boolean;
	status?: string;
	published?: boolean;
	link?: string;
	url?: string;
	curator?: string;
	mentor?: string;
	location?: string;
	place?: string;
	venue?: string;
	[key: string]: unknown;
}

export interface QuestDocument {
	_id: string;
	data: QuestData;
}

export interface Quest {
	_id: string;
	title: string;
	category: string;
	shortDescription: string;
	description: string;
	difficulty: string;
	reward: string;
	duration: string;
	format: string;
	active: boolean;
	link: string;
	curator: string;
	location: string;
	rawData: QuestData;
}

export const QUEST_CATEGORIES = [
	'Освітній',
	'Технічний',
	'Командний',
	'Кар’єрний',
	'Творчий',
];

export const QUEST_DIFFICULTIES = ['Легкий', 'Середній', 'Складний'];
