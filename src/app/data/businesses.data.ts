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
	{
		id: 'cloudnine',
		name: 'CloudNine Systems',
		logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop',
		type: 'Аутсорс',
		shortDescription: 'Хмарна інфраструктура та DevOps-аутсорсинг для середнього та великого бізнесу.',
		description:
			'CloudNine Systems — аутсорсингова компанія з фокусом на хмарній інфраструктурі та DevOps-практиках. Ми допомагаємо компаніям мігрувати в хмару, будувати CI/CD пайплайни та впроваджувати культуру DevOps. Серед наших клієнтів — фінтех-стартапи, онлайн-ритейлери та SaaS-провайдери з України та Польщі.',
		techStack: ['AWS', 'GCP', 'Terraform', 'Kubernetes', 'Helm', 'GitHub Actions'],
		services: [
			'Cloud-міграція',
			'DevOps-консалтинг',
			'CI/CD налаштування',
			'Моніторинг та алертинг',
			'Безпека інфраструктури',
		],
		employees: 32,
		founded: 2016,
		contacts: {
			website: 'https://cloudnine.example.com',
			email: 'ops@cloudnine.example.com',
			linkedin: 'https://linkedin.com/company/cloudnine-systems',
			telegram: 'https://t.me/cloudnine_ops',
			address: 'вул. Франка, 11, Кам\'янець-Подільський',
		},
	},
	{
		id: 'eduflow',
		name: 'EduFlow',
		logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop',
		type: 'Продукт',
		shortDescription: 'EdTech-продукт: платформа онлайн-навчання для шкіл та корпоративного сектору.',
		description:
			'EduFlow — продуктова компанія, що будує власну LMS-платформу для організації онлайн-навчання. Продукт орієнтований на середні школи, університети та корпоративні навчальні центри. Платформа підтримує відео-уроки, тести, прогрес-трекінг та видачу сертифікатів. Активна база — понад 15 000 учнів у 40 навчальних закладах.',
		techStack: ['Angular', 'NestJS', 'MongoDB', 'WebRTC', 'FFmpeg', 'AWS S3'],
		services: [
			'LMS-платформа',
			'Відео-хостинг для навчання',
			'Корпоративне навчання',
			'Інтеграція з HRMS',
		],
		employees: 22,
		founded: 2021,
		contacts: {
			website: 'https://eduflow.example.com',
			email: 'hello@eduflow.example.com',
			telegram: 'https://t.me/eduflow_ua',
			address: 'вул. Грушевського, 17, Кам\'янець-Подільський',
		},
	},
	{
		id: 'brandcraft',
		name: 'BrandCraft Agency',
		logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop',
		type: 'Агентство',
		shortDescription: 'Брендингове агентство: айдентика, стратегія бренду та дизайн-системи.',
		description:
			'BrandCraft Agency спеціалізується на розробці та перезапуску брендів для компаній різного масштабу. Ми допомагаємо бізнесам сформулювати позиціонування, розробити візуальну ідентичність і впровадити єдину дизайн-систему. Портфоліо агентства охоплює понад 60 реалізованих брендинг-проєктів у сфері IT, ритейлу та HoReCa.',
		techStack: ['Figma', 'Illustrator', 'After Effects', 'Webflow', 'Notion'],
		services: [
			'Розробка айдентики',
			'Брендинг-стратегія',
			'Дизайн-система',
			'Редизайн бренду',
			'Моушн-дизайн',
		],
		employees: 14,
		founded: 2014,
		contacts: {
			website: 'https://brandcraft.example.com',
			email: 'brand@brandcraft.example.com',
			linkedin: 'https://linkedin.com/company/brandcraft-agency',
			address: 'вул. Соборна, 33, Кам\'янець-Подільський',
		},
	},
	{
		id: 'datastream',
		name: 'DataStream Analytics',
		logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
		type: 'Продукт',
		shortDescription: 'Аналітична SaaS-платформа для реального часу обробки та візуалізації бізнес-даних.',
		description:
			'DataStream Analytics розробляє власну платформу потокової аналітики для бізнесів, що працюють з великими обсягами даних. Наш продукт дозволяє підключати різні джерела даних, будувати дашборди в реальному часі та налаштовувати автоматичні звіти. Серед клієнтів — логістичні компанії, банки та торгові мережі.',
		techStack: ['React', 'Python', 'Apache Kafka', 'ClickHouse', 'Grafana', 'Docker'],
		services: [
			'Потокова аналітика',
			'BI-дашборди',
			'ETL-пайплайни',
			'Автоматичні звіти',
			'Консалтинг з даних',
		],
		employees: 19,
		founded: 2020,
		contacts: {
			website: 'https://datastream.example.com',
			email: 'info@datastream.example.com',
			linkedin: 'https://linkedin.com/company/datastream-analytics',
			telegram: 'https://t.me/datastream_ua',
			address: 'Старе місто, вул. Іоанна Предтечі, 4, Кам\'янець-Подільський',
		},
	},
	{
		id: 'webforce',
		name: 'WebForce Studio',
		logo: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=200&h=200&fit=crop',
		type: 'Студія',
		shortDescription: 'Веб-студія з повним циклом: від дизайну до деплою на production.',
		description:
			'WebForce Studio — команда із 16 фахівців, що реалізовує веб-проєкти під ключ: від wireframe і дизайну до розробки та підтримки. Наш стек охоплює сучасні фреймворки та CMS. Особлива увага приділяється швидкості завантаження, SEO-оптимізації та адаптивності. Серед наших клієнтів — будівельні компанії, юридичні фірми та готелі.',
		techStack: ['Next.js', 'WordPress', 'PHP', 'MySQL', 'GSAP', 'Tailwind CSS'],
		services: [
			'Розробка сайтів',
			'Корпоративні портали',
			'Інтернет-магазини',
			'SEO-оптимізація',
			'Технічна підтримка',
		],
		employees: 16,
		founded: 2013,
		contacts: {
			website: 'https://webforce.example.com',
			email: 'studio@webforce.example.com',
			telegram: 'https://t.me/webforce_studio',
			address: 'вул. Князів Коріатовичів, 6, Кам\'янець-Подільський',
		},
	},
	{
		id: 'secureops',
		name: 'SecureOps',
		logo: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=200&h=200&fit=crop',
		type: 'Аутсорс',
		shortDescription: 'Кібербезпека та захист IT-інфраструктури: пентест, аудит, SOC.',
		description:
			'SecureOps — спеціалізована компанія у сфері кібербезпеки. Ми проводимо пентести, аудити захищеності, впроваджуємо SOC-рішення та навчаємо команди безпечній розробці. Наші фахівці мають сертифікації CEH, OSCP та ISO 27001 Lead Auditor. Клієнти — банки, страхові компанії та державні установи.',
		techStack: ['Kali Linux', 'Burp Suite', 'Splunk', 'Nessus', 'Wireshark', 'Python'],
		services: [
			'Пентестування',
			'Аудит безпеки',
			'SOC-послуги',
			'Навчання з кібербезпеки',
			'Відповідність стандартам',
		],
		employees: 11,
		founded: 2018,
		contacts: {
			website: 'https://secureops.example.com',
			email: 'security@secureops.example.com',
			linkedin: 'https://linkedin.com/company/secureops-ua',
			address: 'вул. Драгоманова, 2, Кам\'янець-Подільський',
		},
	},
	{
		id: 'medialab',
		name: 'MediaLab Creative',
		logo: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=200&h=200&fit=crop',
		type: 'Агентство',
		shortDescription: 'Контент-агентство: відеовиробництво, подкасти та контент-стратегія для брендів.',
		description:
			'MediaLab Creative — агентство повного циклу контент-маркетингу. Ми знімаємо рекламні ролики, корпоративні відео та YouTube-серіали, записуємо подкасти та розробляємо контент-стратегії. Виробнича база студії дозволяє реалізовувати проєкти будь-якого масштабу — від Instagram Reels до повноцінних рекламних кампаній.',
		techStack: ['Adobe Premiere', 'After Effects', 'DaVinci Resolve', 'Audition', 'Canva'],
		services: [
			'Відеовиробництво',
			'Контент-стратегія',
			'Подкасти',
			'Фотозйомка',
			'Анімація та моушн',
		],
		employees: 9,
		founded: 2019,
		contacts: {
			website: 'https://medialab.example.com',
			email: 'content@medialab.example.com',
			telegram: 'https://t.me/medialab_creative',
			address: 'вул. Татарська, 19, Кам\'янець-Подільський',
		},
	},
	{
		id: 'fintech42',
		name: 'FinTech42',
		logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop',
		type: 'Продукт',
		shortDescription: 'Власний фінтех-продукт: B2B-платіжна інфраструктура та розрахунки для підприємств.',
		description:
			'FinTech42 — продуктова фінтех-компанія, що розробляє власну B2B-платіжну платформу для автоматизації розрахунків між підприємствами. Продукт включає API-інтеграції з банками, модуль звірки платежів та автоматичне формування документів. Платформа сертифікована PCI DSS і обробляє понад 500 000 транзакцій щомісяця.',
		techStack: ['Java', 'Spring Boot', 'Oracle DB', 'Kafka', 'Redis', 'React'],
		services: [
			'B2B-платіжна платформа',
			'API-інтеграції з банками',
			'Автоматизація розрахунків',
			'Фінансова звітність',
		],
		employees: 37,
		founded: 2017,
		contacts: {
			website: 'https://fintech42.example.com',
			email: 'partners@fintech42.example.com',
			linkedin: 'https://linkedin.com/company/fintech42',
			address: 'вул. Огієнка, 7, Кам\'янець-Подільський',
		},
	},
	{
		id: 'softlabs',
		name: 'SoftLabs UA',
		logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop',
		type: 'Аутсорс',
		shortDescription: 'Повноцикловий аутсорс: від бізнес-аналізу та дизайну до розробки і підтримки.',
		description:
			'SoftLabs UA надає послуги аутсорсингової розробки для клієнтів із Великої Британії, Нідерландів та Канади. Компанія спеціалізується на побудові довгострокових команд, що інтегруються в процеси клієнта. Серед реалізованих проєктів — системи управління нерухомістю, платформи для HR-tech та корпоративні портали.',
		techStack: ['Angular', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Azure'],
		services: [
			'Розробка під ключ',
			'Team extension',
			'Бізнес-аналіз',
			'UI/UX дизайн',
			'QA-автоматизація',
		],
		employees: 55,
		founded: 2012,
		contacts: {
			website: 'https://softlabs.example.com',
			email: 'sales@softlabs.example.com',
			linkedin: 'https://linkedin.com/company/softlabs-ua',
			telegram: 'https://t.me/softlabs_ua',
			address: 'пл. Польський ринок, 1, Кам\'янець-Подільський',
		},
	},
	{
		id: 'greencode',
		name: 'GreenCode',
		logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
		type: 'Студія',
		shortDescription: 'Екологічна веб-студія: сайти з мінімальним вуглецевим слідом та зеленим хостингом.',
		description:
			'GreenCode — унікальна веб-студія, що ставить у пріоритет екологічність цифрових продуктів. Ми оптимізуємо сайти для мінімального споживання ресурсів, використовуємо виключно хостинг на відновлюваній енергії та допомагаємо клієнтам вимірювати вуглецевий слід їхніх веб-сервісів. Серед клієнтів — екологічні організації, органічні бренди та B-Corp компанії.',
		techStack: ['Svelte', 'Astro', 'Go', 'SQLite', 'Cloudflare Pages'],
		services: [
			'Eco-friendly веб-розробка',
			'Оптимізація продуктивності',
			'Зелений хостинг',
			'Вуглецевий аудит сайтів',
		],
		employees: 7,
		founded: 2022,
		contacts: {
			website: 'https://greencode.example.com',
			email: 'green@greencode.example.com',
			telegram: 'https://t.me/greencode_studio',
			address: 'вул. Садова, 28, Кам\'янець-Подільський',
		},
	},
];
