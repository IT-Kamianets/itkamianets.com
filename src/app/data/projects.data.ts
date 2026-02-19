export interface Project {
	id: number;
	title: string;
	description: string;
	category: 'theme-tailwind' | 'theme-bulma' | 'theme-bootstrap';
	repoUrl: string;
	liveUrl: string;
	tags: string[];
	image: string;
}

export const PROJECTS: Project[] = [
	// ── Tailwind ──
	{
		id: 1,
		title: 'Demchuk Denys',
		description: 'Персональний сайт-портфоліо, побудований на Tailwind CSS з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-tailwind',
		repoUrl: 'https://github.com/IT-Kamianets/demchukdenys.itkamianets.com',
		liveUrl: 'https://demchukdenys.itkamianets.com',
		tags: ['Tailwind', 'Portfolio', 'Landing'],
		image: 'demchukdenys.itkamianets.com',
	},
	{
		id: 2,
		title: 'MC',
		description: 'Корпоративний веб-сайт із чистим мінімалістичним інтерфейсом на базі Tailwind CSS.',
		category: 'theme-tailwind',
		repoUrl: 'https://github.com/IT-Kamianets/mc.itkamianets.com',
		liveUrl: 'https://mc.itkamianets.com',
		tags: ['Tailwind', 'Corporate', 'Responsive'],
		image: 'mc.itkamianets.com',
	},
	{
		id: 3,
		title: 'SemiMed',
		description: 'Медичний веб-ресурс з інформацією про послуги та онлайн-записом, стилізований Tailwind CSS.',
		category: 'theme-tailwind',
		repoUrl: 'https://github.com/IT-Kamianets/semimed.itkamianets.com',
		liveUrl: 'https://semimed.itkamianets.com',
		tags: ['Tailwind', 'Medicine', 'Services'],
		image: 'semimed.itkamianets.com',
	},
	{
		id: 4,
		title: 'Vernisazh',
		description: 'Корпоративний веб-сайт із чистим мінімалістичним інтерфейсом на базі Tailwind CSS.',
		category: 'theme-tailwind',
		repoUrl: 'https://github.com/IT-Kamianets/vernisazh.itkamianets.com',
		liveUrl: 'https://vernisazh.itkamianets.com',
		tags: ['Tailwind', 'Medicine', 'Services'],
		image: 'vernisazh.itkamianets.com',
	},

	// ── Bulma ──
	{
		id: 5,
		title: 'Kudlati',
		description: 'Сайт для зоосалону з каталогом послуг та онлайн-записом, побудований на Bulma.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/kudlati.itkamianets.com',
		liveUrl: 'https://kudlati.itkamianets.com',
		tags: ['Bulma', 'Pets', 'Services'],
		image: 'kudlati.itkamianets.com',
	},
	{
		id: 6,
		title: 'Dog Style',
		description: 'Стильний сайт для грумінг-салону з галереєю робіт та формою запису.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/dog-style.itkamianets.com',
		liveUrl: 'https://dog-style.itkamianets.com',
		tags: ['Bulma', 'Grooming', 'Gallery'],
		image: 'dog-style.itkamianets.com',
	},
	{
		id: 7,
		title: 'Laznya',
		description: 'Веб-сайт для лазні з описом послуг, прайсом та бронюванням.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/laznya.itkamianets.com',
		liveUrl: 'https://laznya.itkamianets.com',
		tags: ['Bulma', 'Spa', 'Booking'],
		image: 'laznya.itkamianets.com',
	},
	{
		id: 8,
		title: 'AI Lab',
		description: 'Лендінг для лабораторії штучного інтелекту з демонстрацією проєктів та досліджень.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/ai-lab.itkamianets.com',
		liveUrl: 'https://ai-lab.itkamianets.com',
		tags: ['Bulma', 'AI', 'Research'],
		image: 'ai-lab.itkamianets.com',
	},
	{
		id: 9,
		title: 'Novita',
		description: 'Корпоративний сайт компанії з інформацією про продукти та послуги.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/novita.itkamianets.com',
		liveUrl: 'https://novita.itkamianets.com',
		tags: ['Bulma', 'Corporate', 'Products'],
		image: 'novita.itkamianets.com',
	},
	{
		id: 10,
		title: 'Marlin',
		description: 'Бізнес-сайт із каталогом товарів та контактною інформацією на Bulma.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/marlin.itkamianets.com',
		liveUrl: 'https://marlin.itkamianets.com',
		tags: ['Bulma', 'Business', 'Catalog'],
		image: 'marlin.itkamianets.com',
	},

	// ── Bootstrap ──
	{
		id: 11,
		title: 'Monte Kristo',
		description: 'Сайт ресторану з меню, галереєю та системою бронювання столиків на Bootstrap.',
		category: 'theme-bootstrap',
		repoUrl: 'https://github.com/IT-Kamianets/monte-kristo.itkamianets.com',
		liveUrl: 'https://monte-kristo.itkamianets.com',
		tags: ['Bootstrap', 'Restaurant', 'Booking'],
		image: 'monte-kristo.itkamianets.com',
	},
	{
		id: 12,
		title: 'Dominicana',
		description: 'Туристичний сайт з оглядом турів, фотогалереєю та формою замовлення.',
		category: 'theme-bootstrap',
		repoUrl: 'https://github.com/IT-Kamianets/dominicana.itkamianets.com',
		liveUrl: 'https://dominicana.itkamianets.com',
		tags: ['Bootstrap', 'Tourism', 'Travel'],
		image: 'dominicana.itkamianets.com',
	},
	{
		id: 13,
		title: 'Bilya Richky',
		description: 'Сайт бази відпочинку з описом номерів, послуг та онлайн-бронюванням.',
		category: 'theme-bootstrap',
		repoUrl: 'https://github.com/IT-Kamianets/bilya-richky.itkamianets.com',
		liveUrl: 'https://bilya-richky.itkamianets.com',
		tags: ['Bootstrap', 'Resort', 'Booking'],
		image: 'bilya-richky.itkamianets.com',
	},
];
