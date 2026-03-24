export interface Course {
	slug: string;
	title: string;
	level: string;
	duration: string;
	description: string;
	about: string;
	format: string;
	modules: string[];
	results: string[];
}

export const COURSES: Course[] = [
	{
		slug: 'frontend-angular',
		title: 'Frontend Angular',
		level: 'Middle',
		duration: '8 тижнів',
		description:
			'Практичний курс зі створення сучасних SSR-ready інтерфейсів на Angular, Tailwind і PrimeNG.',
		about:
			'Курс побудований навколо реального процесу розробки: архітектура компонентів, роутинг, робота зі станом, адаптивний UI та підготовка проєкту до production.',
		format: 'Онлайн, 2 заняття на тиждень + практика',
		modules: [
			'Архітектура Angular застосунків',
			'Standalone components і маршрутизація',
			'Signals, форми та робота з даними',
			'SSR, prerender та оптимізація',
		],
		results: [
			'Зможете створювати production-ready Angular інтерфейси',
			'Зберете навчальний проєкт у портфоліо',
			'Прокачаєте роботу з сучасним UI стеком',
		],
	},
	{
		slug: 'backend-nodejs',
		title: 'Backend Node.js',
		level: 'Junior',
		duration: '10 тижнів',
		description:
			'Основи побудови API, роботи з базами даних, авторизацією та структурою production-ready сервісів.',
		about:
			'Програма охоплює побудову серверної частини від базового REST API до логування, валідації, авторизації та структури проєкту для командної роботи.',
		format: 'Онлайн, 3 практичні сесії на тиждень',
		modules: [
			'Node.js, Express і структура сервісів',
			'REST API та робота з базами даних',
			'Auth, middlewares і валідація',
			'Деплой, конфіги та безпека',
		],
		results: [
			'Навчитеся будувати бекенд для вебзастосунків',
			'Розберетеся з типовими production-патернами',
			'Підготуєте API-проєкт для портфоліо',
		],
	},
	{
		slug: 'qa-automation',
		title: 'QA Automation',
		level: 'Junior',
		duration: '6 тижнів',
		description:
			'Вступ до автоматизованого тестування, побудови тест-кейсів і перевірки вебзастосунків.',
		about:
			'Фокус курсу на системному підході до якості: аналіз вимог, написання тест-кейсів, запуск автотестів і підготовка зрозумілих звітів для команди.',
		format: 'Онлайн, 2 лекції та 1 лабораторна на тиждень',
		modules: [
			'Основи QA процесу та типи тестування',
			'Тест-дизайн і тестова документація',
			'UI/API automation basics',
			'Звітність, баг-репорти та CI',
		],
		results: [
			'Отримаєте базу для старту в QA',
			'Навчитеся проєктувати тестові сценарії',
			'Зрозумієте, як автоматизація вбудовується в командну розробку',
		],
	},
];
