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
	contacts: {
		website?: string;
		email?: string;
		linkedin?: string;
		telegram?: string;
		address?: string;
	};
}

export const BUSINESS_TYPES = ['Студія', 'Аутсорс', 'Продукт', 'Агентство'];

export const BUSINESSES: Business[] = [
	{
		id: 'pixelcraft',
		name: 'PixelCraft Studio',
		logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=200&fit=crop',
		type: 'Студія',
		shortDescription: 'Дизайн-студія, що спеціалізується на веб-дизайні та брендингу для стартапів.',
		description:
			'PixelCraft Studio — це команда пристрасних дизайнерів і фронтенд-розробників із Кам\'янця-Подільського. Ми створюємо сучасні, функціональні та естетичні цифрові продукти з 2018 року. Наш підхід поєднує глибоке розуміння UX/UI з технічною майстерністю, що дозволяє будувати рішення, які не лише виглядають чудово, а й чудово працюють.',
		techStack: ['Figma', 'Angular', 'React', 'SCSS', 'Storybook'],
		services: ['Веб-дизайн', 'Брендинг', 'UX/UI аудит', 'Фронтенд-розробка'],
		employees: 12,
		founded: 2018,
		contacts: {
			website: 'https://pixelcraft.example.com',
			email: 'hello@pixelcraft.example.com',
			telegram: 'https://t.me/pixelcraft_studio',
			address: 'вул. Шевченка, 14, Кам\'янець-Подільський',
		},
	},
	{
		id: 'devbridge',
		name: 'DevBridge Solutions',
		logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
		type: 'Аутсорс',
		shortDescription: 'Аутсорсингова компанія повного циклу з фокусом на enterprise-рішення.',
		description:
			'DevBridge Solutions надає повний спектр послуг з аутсорсингової розробки програмного забезпечення для клієнтів у Європі та США. Заснована у 2015 році, компанія виросла до 45 фахівців і реалізувала понад 120 проєктів у сферах фінтеху, логістики та e-commerce. Ми цінуємо прозорість, якість коду та довгострокові партнерські відносини.',
		techStack: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'NestJS'],
		services: [
			'Backend-розробка',
			'Архітектура систем',
			'DevOps',
			'QA та тестування',
			'Технічний консалтинг',
		],
		employees: 45,
		founded: 2015,
		contacts: {
			website: 'https://devbridge.example.com',
			email: 'contact@devbridge.example.com',
			linkedin: 'https://linkedin.com/company/devbridge-solutions',
			telegram: 'https://t.me/devbridge',
			address: 'вул. Лесі Українки, 3, Кам\'янець-Подільський',
		},
	},
	{
		id: 'agrotech',
		name: 'AgroTech Platform',
		logo: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&h=200&fit=crop',
		type: 'Продукт',
		shortDescription: 'Власна SaaS-платформа для управління агробізнесом та аналітики врожайності.',
		description:
			'AgroTech Platform — це продуктова компанія, що розробляє і підтримує власну хмарну платформу для агропідприємств. Наш продукт допомагає фермерам та агрохолдингам управляти полями, відстежувати врожайність, планувати роботи та аналізувати прибутковість. Платформою користуються понад 200 господарств по всій Україні.',
		techStack: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'GIS'],
		services: ['SaaS-підписка', 'Впровадження та навчання', 'API-інтеграції', 'Аналітика даних'],
		employees: 28,
		founded: 2019,
		contacts: {
			website: 'https://agrotech.example.com',
			email: 'info@agrotech.example.com',
			telegram: 'https://t.me/agrotech_platform',
			address: 'Подільська вул., 22, Кам\'янець-Подільський',
		},
	},
	{
		id: 'digitalwave',
		name: 'DigitalWave Agency',
		logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop',
		type: 'Агентство',
		shortDescription: 'Діджитал-агентство: реклама, SEO, SMM та комплексний інтернет-маркетинг.',
		description:
			'DigitalWave — повноцикловий маркетинговий партнер для бізнесів, що прагнуть зростати в цифровому просторі. Команда агентства охоплює фахівців із контекстної реклами, SEO-просування, SMM та веб-аналітики. За 7 років роботи ми допомогли більш ніж 80 компаніям збільшити онлайн-продажі і впізнаваність бренду.',
		techStack: ['Google Ads', 'Meta Ads', 'GA4', 'SEMrush', 'HubSpot'],
		services: [
			'SEO-просування',
			'Контекстна реклама',
			'SMM',
			'Email-маркетинг',
			'Веб-аналітика',
			'Розробка лендингів',
		],
		employees: 18,
		founded: 2017,
		contacts: {
			website: 'https://digitalwave.example.com',
			email: 'hello@digitalwave.example.com',
			linkedin: 'https://linkedin.com/company/digitalwave-agency',
			telegram: 'https://t.me/digitalwave_agency',
			address: 'вул. Героїв УПА, 8, Кам\'янець-Подільський',
		},
	},
	{
		id: 'mobilemind',
		name: 'MobileMind Labs',
		logo: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=200&fit=crop',
		type: 'Студія',
		shortDescription: 'Мобільна студія з розробки iOS та Android застосунків для стартапів і бізнесу.',
		description:
			'MobileMind Labs спеціалізується виключно на мобільній розробці: від ідеї та прототипу до публікації в App Store і Google Play. Наша команда з 20 фахівців має досвід у розробці застосунків для ритейлу, медицини, логістики та HoReCa. Ми використовуємо як нативний підхід (Swift, Kotlin), так і кросплатформні рішення (Flutter, React Native).',
		techStack: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'GraphQL'],
		services: [
			'Мобільна розробка',
			'Дизайн застосунків',
			'QA та тестування',
			'ASO',
			'Підтримка і розвиток',
		],
		employees: 20,
		founded: 2020,
		contacts: {
			website: 'https://mobilemind.example.com',
			email: 'dev@mobilemind.example.com',
			linkedin: 'https://linkedin.com/company/mobilemind-labs',
			telegram: 'https://t.me/mobilemind_labs',
			address: 'Старобульварна вул., 5, Кам\'янець-Подільський',
		},
	},
];
