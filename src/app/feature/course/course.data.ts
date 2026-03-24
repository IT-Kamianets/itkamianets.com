export interface Lesson {
	slug: string;
	title: string;
	duration: string;
	summary: string;
	youtubeId: string;
	objectives: string[];
	content: string[];
}

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
	lessons: Lesson[];
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
		lessons: [
			{
				slug: 'angular-architecture-basics',
				title: 'Angular Architecture Basics',
				duration: '24 хв',
				summary:
					'Огляд структури Angular застосунку, ролей компонентів, маршрутів і розділення відповідальності.',
				youtubeId: 'jNCevxohh4k',
				objectives: [
					'Зрозуміти, як організовується feature-based структура',
					'Побачити різницю між layout, page і shared елементами',
					'Підготувати основу для масштабованого курсового проєкту',
				],
				content: [
					'Урок пояснює, як розкладати застосунок на фічі, сторінки та перевикористовувані блоки без хаотичного росту директорій.',
					'Окремий акцент зроблено на standalone components, lazy-loaded routes та практиці, яка не ламає SSR і prerender.',
					'Наприкінці є короткий розбір того, як вибирати місце для сервісів, типів і UI-складників у реальному проєкті.',
				],
			},
			{
				slug: 'signals-and-state',
				title: 'Signals and UI State',
				duration: '31 хв',
				summary:
					'Практика роботи з signals, computed-значеннями та локальним станом у сучасному Angular UI.',
				youtubeId: 'kY4FTWzQmYw',
				objectives: [
					'Освоїти базові сценарії використання signal і computed',
					'Навчитися тримати стан близько до шаблону',
					'Зменшити потребу в зайвій імперативній логіці',
				],
				content: [
					'Урок починається з простих state-сценаріїв у компоненті, а далі показує, як не перетворити signals на ще одну складну абстракцію.',
					'Розглядається, коли вистачає локального сигналу, а коли варто піднімати стан у сервіс або feature-рівень.',
					'У фіналі є приклад UI-потоку з фільтрами, computed даними і мінімальною кількістю ручних оновлень.',
				],
			},
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
		lessons: [
			{
				slug: 'express-routing-foundation',
				title: 'Express Routing Foundation',
				duration: '27 хв',
				summary:
					'Побудова чистої структури роутів, контролерів і сервісів для підтримуваного backend-коду.',
				youtubeId: 'SccSCuHhOw0',
				objectives: [
					'Розібрати базову архітектуру Express сервісу',
					'Навчитися відокремлювати transport layer від бізнес-логіки',
					'Підготувати основу для CRUD API',
				],
				content: [
					'Урок показує, як організувати backend так, щоб логіка не розмазувалася по middleware та route handlers.',
					'Розглядається мінімальний набір шарів: routes, controllers, services, validation.',
					'Окремий блок присвячено помилкам структури, які ускладнюють тестування та розширення API.',
				],
			},
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
		lessons: [
			{
				slug: 'test-case-design',
				title: 'Test Case Design',
				duration: '22 хв',
				summary:
					'Структурування тест-кейсів, пріоритизація перевірок і базові евристики для якісного покриття.',
				youtubeId: 'u6QfIXgjwGQ',
				objectives: [
					'Зрозуміти, що робить тест-кейс корисним для команди',
					'Відпрацювати підхід до пріоритезації сценаріїв',
					'Підготуватися до переходу від ручних тестів до автоматизації',
				],
				content: [
					'Урок розбирає, як писати тест-кейси так, щоб ними могли користуватися не лише QA, а й розробники та менеджери.',
					'Пояснюється, як відбирати критичні сценарії, уникати дублювання та тримати документацію актуальною.',
					'Останній блок зводить це до практики автоматизації: що варто переводити в автотести в першу чергу.',
				],
			},
		],
	},
];

export const COURSE_LESSON_PARAMS = COURSES.flatMap((course) =>
	course.lessons.map((lesson) => ({
		courseSlug: course.slug,
		lessonSlug: lesson.slug,
	})),
);
