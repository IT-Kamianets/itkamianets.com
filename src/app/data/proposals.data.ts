export interface Proposal {
	id: number;
	title: string;
	shortDescription: string;
	fullDescription: string;
	category: string;
	image: string;
	features: string[];
	team: { name: string; avatar: string; role: string }[];
	priceFrom: number;
	priceTo: number;
	timeFrom: number;
	timeTo: number;
}

export const CATEGORIES: string[] = [
	'Лендінг',
	'Динамічний лендінг',
	'Автоматизація',
	'Екосистема',
];

export const PROPOSALS: Proposal[] = [
	{
		id: 1,
		title: 'Лендінг сторінка',
		shortDescription: 'Професійна односторінкова візитка для вашого бізнесу.',
		fullDescription:
			'Створення високоефективної посадкової сторінки, орієнтованої на конверсію. Ми розробляємо унікальний дизайн, який підкреслює переваги вашого продукту або послуги, забезпечуючи максимальну залученість відвідувачів. Ідеально підходить для швидкого старту та презентації конкретної пропозиції.',
		category: 'Лендінг',
		image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
		features: [
			'Унікальний дизайн',
			'Адаптивність під мобільні пристрої',
			'Оптимізація швидкості завантаження',
			'Базова SEO-підготовка',
			'Форми зворотного зв’язку',
		],
		team: [
			{
				name: 'Гончар Денис',
				avatar: 'assets/developer/Honchar_Denys.png',
				role: 'Full-stack',
			},
			{
				name: 'Макуш Валерія',
				avatar: 'assets/developer/Valery_Makush.png',
				role: 'UI/UX Designer',
			},
		],
		priceFrom: 5000,
		priceTo: 10000,
		timeFrom: 1,
		timeTo: 2,
	},
	{
		id: 2,
		title: 'Динамічна зміна лендінгу',
		shortDescription: 'Лендінг з можливістю самостійного керування контентом.',
		fullDescription:
			'Розширене рішення, яке включає інтегровану систему керування вмістом (CMS). Ви отримуєте можливість самостійно змінювати тексти, зображення, ціни та акційні пропозиції без залучення розробників. Це дозволяє гнучко адаптувати сайт під актуальні потреби ринку в режимі реального часу.',
		category: 'Динамічний лендінг',
		image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=500&fit=crop',
		features: [
			'Зручна панель адміністратора',
			'Редагування контенту в один клік',
			'Керування медіа-бібліотекою',
			'Можливість додавання нових блоків',
			'Аналітика відвідуваності',
		],
		team: [
			{
				name: 'Гончар Денис',
				avatar: 'assets/developer/Honchar_Denys.png',
				role: 'Full-stack',
			},
			{
				name: 'Вальцер Вадим',
				avatar: 'assets/developer/Vadim_Valtser.png',
				role: 'Frontend',
			},
		],
		priceFrom: 12000,
		priceTo: 25000,
		timeFrom: 2,
		timeTo: 4,
	},
	{
		id: 3,
		title: 'Додаткове автоматизоване керування сайтом',
		shortDescription: 'Автоматизація бізнес-процесів та глибока аналітика.',
		fullDescription:
			'Потужна система, яка бере на себе рутинні задачі. Ми впроваджуємо автоматичне опрацювання заявок, інтеграцію з CRM-системами, автоматичні розсилки та сповіщення. Ваша команда зможе фокусуватися на продажах, поки система забезпечує безперебійну технічну роботу та збір даних.',
		category: 'Автоматизація',
		image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
		features: [
			'Інтеграція з CRM (Bitrix24, Pipedrive тощо)',
			'Автоматичні Email/Telegram сповіщення',
			'Глибока система звітів та аналітики',
			'Автоматизація складського обліку',
			'Система онлайн-платежів',
		],
		team: [
			{
				name: 'Гончар Денис',
				avatar: 'src/app/assets/developer/Honchar_Denys.png',
				role: 'Full-stack',
			},
			{
				name: 'Шулепко Роман',
				avatar: 'src/app/assets/developer/Roman_Shulepko.png',
				role: 'Frontend',
			},
		],
		priceFrom: 30000,
		priceTo: 60000,
		timeFrom: 4,
		timeTo: 8,
	},
	{
		id: 4,
		title: 'Прив’язка інших бізнесів',
		shortDescription: 'Створення цілісної екосистеми для масштабування.',
		fullDescription:
			'Найбільш комплексне рішення для великих проектів або мереж. Ми об’єднуємо кілька веб-ресурсів, мобільних додатків та сторонніх сервісів у єдину екосистему. Спільна база користувачів, крос-платформна аналітика та партнерські інтеграції дозволяють ефективно масштабувати ваш бізнес та залучати нових клієнтів через мережевий ефект.',
		category: 'Екосистема',
		image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
		features: [
			'Multi-site архітектура',
			'Єдина система авторизації (SSO)',
			'API для зовнішніх інтеграцій',
			'Партнерські кабінети',
			'Масштабована хмарна інфраструктура',
		],
		team: [
			{
				name: 'Гончар Денис',
				avatar: 'assets/developer/Honchar_Denys.png',
				role: 'Full-stack',
			},
			{
				name: 'Левчук Владислав',
				avatar: 'assets/developer/VladLevchuk.png',
				role: 'Frontend',
			},
		],
		priceFrom: 70000,
		priceTo: 150000,
		timeFrom: 8,
		timeTo: 16,
	},
];
