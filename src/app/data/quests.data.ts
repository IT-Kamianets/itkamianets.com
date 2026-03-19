import { Quest } from '../feature/quest/quest.interface';

export const QUESTS: Quest[] = [
	{
		id: 'frontend-onboarding',
		title: 'Frontend Onboarding',
		category: 'Освітній',
		shortDescription: 'Серія практичних завдань для старту в Angular команді.',
		description:
			'Квест допомагає новачкам пройти базові етапи входу в проєкт: структура репозиторію, SSR, компоненти та робота з UI.',
		difficulty: 'Легкий',
		reward: 'Сертифікат та рекомендація до pet-проєкту',
		duration: '5 днів',
		format: 'Онлайн',
		active: true,
		link: 'https://itkamianets.com/quests/frontend-onboarding',
		curator: 'Команда IT KAMIANETS',
		location: 'Кам’янець-Подільський',
	},
	{
		id: 'startup-validation',
		title: 'Startup Validation Sprint',
		category: 'Командний',
		shortDescription: 'Перевірка ідеї продукту через інтерв’ю, прототип та презентацію.',
		description:
			'Учасники працюють в командах, готують гіпотези, тестують попит і формують короткий пітч для менторів.',
		difficulty: 'Середній',
		reward: 'Менторська сесія та демо-день',
		duration: '2 тижні',
		format: 'Гібридний',
		active: true,
		link: 'https://itkamianets.com/quests/startup-validation',
		curator: 'Startup Office',
		location: 'Hub IT KAMIANETS',
	},
];
