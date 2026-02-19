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
	'Агроіндустрія',
	'Медицина',
	'Заклади',
	'Мистецтво',
	'Автомобілі',
	'Мода та одяг',
	'Туризм',
	'Спорт',
	'Освіта',
];

export const PROPOSALS: Proposal[] = [
	// ── Агроіндустрія ──
	{
		id: 1,
		title: 'Система моніторингу полів',
		shortDescription: 'Інтерактивна карта полів з GPS-трекінгом та аналітикою врожайності.',
		fullDescription: 'Повноцінна веб-платформа для моніторингу сільськогосподарських угідь із інтеграцією GPS-трекінгу техніки, аналізом якості ґрунтів та прогнозуванням врожайності на основі історичних даних.',
		category: 'Агроіндустрія',
		image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['GPS-трекінг', 'Аналітика ґрунтів', 'Прогноз врожайності', 'Мобільний доступ'],
		team: [
			{ name: 'Гончар Денис', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Full-stack' }, // назва файлу з папки public/images/team/
			{ name: 'Вальцер Вадим', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 15000,
		priceTo: 35000,
		timeFrom: 4,
		timeTo: 8,
	},
	{
		id: 2,
		title: 'Маркетплейс агропродукції',
		shortDescription: 'Онлайн-платформа для купівлі-продажу сільськогосподарської продукції.',
		fullDescription: 'B2B маркетплейс для фермерів та закупівельників з системою аукціонів, логістичними інтеграціями та безпечними онлайн-оплатами.',
		category: 'Агроіндустрія',
		image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Онлайн-аукціони', 'Логістика', 'Безпечна оплата', 'Рейтинги продавців'],
		team: [
			{ name: 'Гончар Денис', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Full-stack' }, // назва файлу з папки public/images/team/
			{ name: 'Гумельник Анатолій', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 20000,
		priceTo: 50000,
		timeFrom: 6,
		timeTo: 12,
	},

	// ── Медицина ──
	{
		id: 3,
		title: 'Електронна реєстратура',
		shortDescription: 'Запис до лікаря онлайн з інтеграцією електронних медичних карток.',
		fullDescription: 'Система онлайн-запису для клінік з електронними картками пацієнтів, нагадуваннями про візити через SMS/email та інтеграцією з лабораторними системами.',
		category: 'Медицина',
		image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Онлайн-запис', 'Електронні картки', 'SMS-нагадування', 'Інтеграція з лабораторіями'],
		team: [
			{ name: 'Окряк Віктор', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Демчина Дмитро', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 18000,
		priceTo: 40000,
		timeFrom: 5,
		timeTo: 10,
	},
	{
		id: 4,
		title: 'Аптечний портал',
		shortDescription: 'Пошук ліків у найближчих аптеках з порівнянням цін.',
		fullDescription: 'Агрегатор аптек із зручним пошуком медикаментів, порівнянням цін, інформацією про наявність та можливістю бронювання ліків онлайн.',
		category: 'Медицина',
		image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Пошук ліків', 'Порівняння цін', 'Бронювання', 'Геолокація аптек'],
		team: [
			{ name: 'Шулепко Роман', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Данильчук Андрій', avatar: 'https://randomuser.me/api/portraits/men/85.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 12000,
		priceTo: 28000,
		timeFrom: 3,
		timeTo: 7,
	},

	// ── Заклади ──
	{
		id: 5,
		title: 'Система онлайн-замовлень',
		shortDescription: 'Меню та замовлення онлайн для кафе та ресторанів.',
		fullDescription: 'Повнофункціональна система для закладів харчування: цифрове меню з фото, онлайн-замовлення, інтеграція з кухонним дисплеєм та системою доставки.',
		category: 'Заклади',
		image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Цифрове меню', 'Онлайн-замовлення', 'Кухонний дисплей', 'Доставка'],
		team: [
			{ name: 'Гончар Денис', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Full-stack' }, // назва файлу з папки public/images/team/
			{ name: 'Левчук Владислав', avatar: 'https://randomuser.me/api/portraits/men/91.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 10000,
		priceTo: 25000,
		timeFrom: 3,
		timeTo: 6,
	},
	{
		id: 6,
		title: 'Платформа бронювання столиків',
		shortDescription: 'Бронювання столиків онлайн з можливістю передзамовлення.',
		fullDescription: 'Сервіс бронювання столиків для ресторанів та кафе із інтерактивною схемою залу, передзамовленням страв та автоматичним підтвердженням.',
		category: 'Заклади',
		image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Схема залу', 'Передзамовлення', 'Підтвердження', 'Відгуки'],
		team: [
			{ name: 'Вальцер Вадим', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Горецький Максим', avatar: 'https://randomuser.me/api/portraits/men/47.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 8000,
		priceTo: 20000,
		timeFrom: 2,
		timeTo: 5,
	},

	// ── Мистецтво ──
	{
		id: 7,
		title: 'Онлайн-галерея',
		shortDescription: 'Платформа для митців з можливістю продажу творів мистецтва.',
		fullDescription: 'Віртуальна галерея із 3D-оглядом робіт, можливістю покупки, портфоліо митців та інтеграцією з соціальними мережами.',
		category: 'Мистецтво',
		image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['3D-огляд', 'Продаж творів', 'Портфоліо', 'Соцмережі'],
		team: [
			{ name: 'Макуш Валерія', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'UI/UX' }, // назва файлу з папки public/images/team/
			{ name: 'Гумельник Анатолій', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 12000,
		priceTo: 30000,
		timeFrom: 4,
		timeTo: 8,
	},
	{
		id: 8,
		title: 'Платформа для культурних подій',
		shortDescription: 'Афіша культурних подій міста з продажем квитків.',
		fullDescription: 'Платформа для організації та просування культурних подій: виставок, концертів, вистав. Онлайн-продаж квитків та інтерактивна карта локацій.',
		category: 'Мистецтво',
		image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Афіша подій', 'Онлайн-квитки', 'Карта локацій', 'Push-сповіщення'],
		team: [
			{ name: 'Окряк Віктор', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Макуш Валерія', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'UI/UX' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 15000,
		priceTo: 35000,
		timeFrom: 5,
		timeTo: 10,
	},

	// ── Автомобілі ──
	{
		id: 9,
		title: 'Сайт для автосервісу',
		shortDescription: 'Онлайн-запис на СТО з відстеженням статусу ремонту.',
		fullDescription: 'Комплексна платформа для автосервісів: онлайн-запис, CRM для клієнтів, відстеження процесу ремонту та інтеграція з каталогом запчастин.',
		category: 'Автомобілі',
		image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Онлайн-запис', 'CRM', 'Статус ремонту', 'Каталог запчастин'],
		team: [
			{ name: 'Демчина Дмитро', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Шулепко Роман', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 10000,
		priceTo: 25000,
		timeFrom: 3,
		timeTo: 7,
	},
	{
		id: 10,
		title: 'Маркетплейс автозапчастин',
		shortDescription: 'Пошук та порівняння запчастин від різних постачальників.',
		fullDescription: 'Маркетплейс для пошуку автозапчастин за VIN-кодом або моделлю авто. Порівняння цін, рейтинги постачальників та доставка по Україні.',
		category: 'Автомобілі',
		image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Пошук за VIN', 'Порівняння цін', 'Рейтинги', 'Доставка'],
		team: [
			{ name: 'Данильчук Андрій', avatar: 'https://randomuser.me/api/portraits/men/85.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Левчук Владислав', avatar: 'https://randomuser.me/api/portraits/men/91.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 18000,
		priceTo: 45000,
		timeFrom: 5,
		timeTo: 10,
	},

	// ── Мода та одяг ──
	{
		id: 11,
		title: 'Інтернет-магазин одягу',
		shortDescription: 'Повнофункціональний e-commerce з системою розмірів та примірки.',
		fullDescription: 'Сучасний інтернет-магазин одягу із розумною системою рекомендацій, таблицею розмірів, фото 360° та інтеграцією з платіжними системами.',
		category: 'Мода та одяг',
		image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Каталог з фільтрами', 'Система розмірів', 'Онлайн-оплата', 'Рекомендації'],
		team: [
			{ name: 'Макуш Валерія', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'UI/UX' }, // назва файлу з папки public/images/team/
			{ name: 'Вальцер Вадим', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 15000,
		priceTo: 40000,
		timeFrom: 4,
		timeTo: 9,
	},
	{
		id: 12,
		title: 'Платформа для дизайнерів',
		shortDescription: 'Портфоліо-платформа для модних дизайнерів.',
		fullDescription: 'Платформа для українських дизайнерів з можливістю створення портфоліо, продажу колекцій та взаємодії з покупцями та байерами.',
		category: 'Мода та одяг',
		image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Портфоліо', 'Продаж колекцій', 'Зв\'язок з байерами', 'Лукбуки'],
		team: [
			{ name: 'Горецький Максим', avatar: 'https://randomuser.me/api/portraits/men/47.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Макуш Валерія', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', role: 'UI/UX' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 12000,
		priceTo: 30000,
		timeFrom: 4,
		timeTo: 8,
	},

	// ── Туризм ──
	{
		id: 13,
		title: 'Портал бронювання турів',
		shortDescription: 'Платформа для бронювання екскурсій та турів по Кам\'янець-Подільському.',
		fullDescription: 'Туристичний портал з каталогом турів, онлайн-бронюванням, інтерактивною картою пам\'яток та відгуками відвідувачів.',
		category: 'Туризм',
		image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Каталог турів', 'Онлайн-бронювання', 'Карта пам\'яток', 'Відгуки'],
		team: [
			{ name: 'Гончар Денис', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Full-stack' }, // назва файлу з папки public/images/team/
			{ name: 'Окряк Віктор', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 14000,
		priceTo: 35000,
		timeFrom: 4,
		timeTo: 9,
	},
	{
		id: 14,
		title: 'Мобільний гід по місту',
		shortDescription: 'Інтерактивний гід з аудіоекскурсіями та AR-елементами.',
		fullDescription: 'PWA-додаток для туристів з аудіогідом, AR-навігацією по історичних місцях, офлайн-картами та рекомендаціями найкращих закладів.',
		category: 'Туризм',
		image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Аудіогід', 'AR-навігація', 'Офлайн-карти', 'Рекомендації'],
		team: [
			{ name: 'Гумельник Анатолій', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Демчина Дмитро', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 20000,
		priceTo: 50000,
		timeFrom: 6,
		timeTo: 12,
	},

	// ── Спорт ──
	{
		id: 15,
		title: 'Платформа для фітнес-клубу',
		shortDescription: 'CRM для фітнес-клубів з управлінням абонементами та розкладом.',
		fullDescription: 'Комплексна система для фітнес-клубів: управління абонементами, розклад тренувань, профілі тренерів, онлайн-запис на заняття та аналітика відвідувань.',
		category: 'Спорт',
		image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Абонементи', 'Розклад', 'Онлайн-запис', 'Аналітика'],
		team: [
			{ name: 'Шулепко Роман', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Данильчук Андрій', avatar: 'https://randomuser.me/api/portraits/men/85.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 12000,
		priceTo: 30000,
		timeFrom: 4,
		timeTo: 8,
	},
	{
		id: 16,
		title: 'Спортивний портал міста',
		shortDescription: 'Новини спорту, розклад змагань та рейтинги команд.',
		fullDescription: 'Портал спортивного життя міста: новини, розклад змагань, таблиці рейтингів, профілі спортсменів та онлайн-трансляції подій.',
		category: 'Спорт',
		image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Новини', 'Розклад змагань', 'Рейтинги', 'Онлайн-трансляції'],
		team: [
			{ name: 'Левчук Владислав', avatar: 'https://randomuser.me/api/portraits/men/91.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Горецький Максим', avatar: 'https://randomuser.me/api/portraits/men/47.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 10000,
		priceTo: 25000,
		timeFrom: 3,
		timeTo: 7,
	},

	// ── Освіта ──
	{
		id: 17,
		title: 'LMS-платформа',
		shortDescription: 'Система управління навчанням з курсами та тестуванням.',
		fullDescription: 'Платформа дистанційного навчання з відеокурсами, інтерактивними тестами, системою оцінювання та сертифікатами по завершенню.',
		category: 'Освіта',
		image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Відеокурси', 'Тестування', 'Оцінювання', 'Сертифікати'],
		team: [
			{ name: 'Гончар Денис', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', role: 'Full-stack' }, // назва файлу з папки public/images/team/
			{ name: 'Вальцер Вадим', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 20000,
		priceTo: 50000,
		timeFrom: 6,
		timeTo: 12,
	},
	{
		id: 18,
		title: 'Портал для школи',
		shortDescription: 'Електронний щоденник, розклад та комунікація з батьками.',
		fullDescription: 'Шкільний портал з електронним щоденником, розкладом занять, домашніми завданнями, чатом між вчителями та батьками та онлайн-оплатою послуг.',
		category: 'Освіта',
		image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop', // назва файлу з папки public/images/proposals/
		features: ['Е-щоденник', 'Розклад', 'Чат', 'Онлайн-оплата'],
		team: [
			{ name: 'Окряк Віктор', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
			{ name: 'Гумельник Анатолій', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', role: 'Frontend' }, // назва файлу з папки public/images/team/
		],
		priceFrom: 15000,
		priceTo: 35000,
		timeFrom: 5,
		timeTo: 10,
	},
];
