export interface EventCard {
	id: number;
	title: string;
	description: string;
	date: string;
	time: string;
	location: string;
	image?: string;
	link?: string;
	type: string;
}

export const EVENTS: EventCard[] = [
	{
		id: 1,
		title: 'IT Networking Day',
		description: 'Зустріч IT-спільноти міста для обміну досвідом та новими знайомствами. Обговорення актуальних трендів та майбутніх проектів.',
		date: '25 Травня, 2026',
		time: '18:00',
		location: 'Hub Kamianets',
		type: 'Нетворкінг',
		link: '#'
	},
	{
		id: 2,
		title: 'Frontend Workshop: Angular 19',
		description: 'Глибоке занурення в нові можливості Angular 19. Практичні приклади використання сигналів та нових декораторів.',
		date: '10 Червня, 2026',
		time: '14:00',
		location: 'Online',
		type: 'Майстер-клас',
		link: '#'
	},
	{
		id: 3,
		title: 'Kamianets Tech Summit',
		description: 'Найбільша технологічна конференція регіону. Спікери з провідних IT-компаній України та світу.',
		date: '15 Липня, 2026',
		time: '10:00',
		location: 'Готель "7 Днів"',
		type: 'Конференція',
		link: '#'
	},
	{
		id: 4,
		title: 'English for IT',
		description: 'Практичне заняття з англійської мови для IT-спеціалістів. Розбір технічної термінології та симуляція співбесіди.',
		date: '05 Серпня, 2026',
		time: '18:30',
		location: 'Hub Kamianets',
		type: 'Майстер-клас',
		link: '#'
	},
	{
		id: 5,
		title: 'IT Cafe: Startup Pitch',
		description: 'Неформальна зустріч у форматі пітчингу ідей. Можливість представити свій стартап та знайти однодумців.',
		date: '20 Серпня, 2026',
		time: '19:00',
		location: 'Кав\'ярня "Сито"',
		type: 'Нетворкінг',
		link: '#'
	}
];
