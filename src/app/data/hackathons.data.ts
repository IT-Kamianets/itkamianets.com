import { repos } from './repos';

interface RepoContributor {
	login: string;
	contributions: number;
	profile_url: string;
}

interface RepoRecord {
	id: number;
	name: string;
	company?: string;
	url: string;
	created: string;
	updated: string;
	contributors?: RepoContributor[];
}

export interface HackathonCard {
	id: number;
	title: string;
	format: string;
	season: string;
	focus: string;
	description: string;
	stack: string[];
	period: string;
	cta: string;
}

export interface HackathonJudge {
	name: string;
	photo: string;
	description: string;
}

export interface HackathonDeveloper {
	username: string;
	fullName: string;
	projects: {
		name: string;
		url: string;
	}[];
	note?: string;
}

export interface HackathonTeam {
	id: string;
	name: string;
	framework: string;
	description: string;
	highlights: string[];
	developers: HackathonDeveloper[];
}

export interface HackathonDetail {
	title: string;
	label: string;
	period: string;
	description: string;
	format: string;
	result: string;
	judgesTitle: string;
	judgesSubtitle: string;
	teamsTitle: string;
	teamsSubtitle: string;
	judges: HackathonJudge[];
	teams: HackathonTeam[];
}

const repoRecords = repos as RepoRecord[];

const USERNAME_ALIASES: Record<string, string[]> = {
	andre20122002: ['andre20122002', 'Andre123451'],
};

const USERNAME_REPO_NAMES: Record<string, string[]> = {
	VladLevchuk2009: [
		'baron-munchausen.itkamianets.com',
		'bilya-richky.itkamianets.com',
		'romantic-guest-house.itkamianets.com',
		'bilyi-patsyuk.itkamianets.com',
	],
};

const formatProjectName = (value: string): string => {
	const normalized = value.replace('.itkamianets.com', '').replace(/-/g, ' ').trim();

	if (!normalized) {
		return value;
	}

	if (normalized.toLowerCase() === 'mc') {
		return 'MC';
	}

	return normalized
		.split(/\s+/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
};

const getProjectNamesFor = (username: string): { name: string; url: string }[] =>
	repoRecords
		.filter((repo) => {
			const assignedRepoNames = USERNAME_REPO_NAMES[username];

			if (assignedRepoNames?.includes(repo.name)) {
				return true;
			}

			const usernames = USERNAME_ALIASES[username] ?? [username];
			const contributors = repo.contributors ?? [];
			const contributor = contributors
				.filter((item) => usernames.includes(item.login))
				.sort((left, right) => right.contributions - left.contributions)[0];

			if (!contributor) {
				return false;
			}

			return contributors.every(
				(item) =>
					usernames.includes(item.login) ||
					item.contributions <= contributor.contributions,
			);
		})
		.map((repo) => ({
			name: formatProjectName(repo.company || repo.name),
			url: `https://${repo.name}`,
		}))
		.sort((left, right) => left.name.localeCompare(right.name));

export const HACKATHONS: HackathonCard[] = [
	{
		id: 1,
		title: 'Web Art Work Практика 2026',
		format: 'Внутрішній командний хакатон',
		season: 'Весна 2026',
		focus: 'Tailwind, Bootstrap та Bulma проти спільного дедлайну',
		description:
			'Три внутрішні команди розробників презентують прототипи, робочі демо та стратегію запуску для журі та партнерів.',
		stack: ['Tailwind', 'Bootstrap', 'Bulma', 'Demo Day'],
		period: '2 лютого - 13 березня 2026',
		cta: '/hackathon',
	},
];

export const HACKATHON_PAGE: HackathonDetail = {
	title: 'Web Art Work Практика 2026',
	label: 'Хакатон практики',
	period: '2 лютого - 13 березня 2026',
	description:
		'Три внутрішні команди розробників презентують прототипи, робочі демо та стратегію запуску для журі та партнерів.',
	format: 'Три команди, окремі UI-фреймворки, фінальна презентація з живими демо.',
	result: 'Кожна команда показує готові сторінки, набір проєктів зі свого стеку та короткий план подальшого запуску.',
	judgesTitle: 'Журі',
	judgesSubtitle: 'Експертна комісія фінального перегляду',
	teamsTitle: 'Команди',
	teamsSubtitle: 'Склад команд і проєкти, які вони ведуть у межах практики',
	judges: [
		{
			name: 'Andrew Momot',
			photo: 'judges/Andrew Momot.jpg',
			description:
				'Front-end Angular developer, web designer та mobile app designer з досвідом понад 10 років.',
		},
		{
			name: 'Dmytro Maksiuta',
			photo: 'judges/Dmytro Maksiuta.jpg',
			description: 'QA tester, Front-end Angular і React developer з досвідом понад 8 років.',
		},
		{
			name: 'Diana Irikova',
			photo: 'judges/Diana Irikova.png',
			description: 'Senior QA tester з досвідом у QA понад 6 років.',
		},
		{
			name: 'Solomia Maksiuta',
			photo: 'judges/Solomia Maksiuta.jpg',
			description: 'QA tester з досвідом у QA понад 3 роки.',
		},
		{
			name: 'Vladuslava Dzuryk',
			photo: 'judges/Vladuslava Dzuryk.png',
			description:
				'QA tester, менеджерка Web Art Work та Молодіжного центру з досвідом понад 2 роки.',
		},
	],
	teams: [
		{
			id: 'tailwind',
			name: 'Tailwind team',
			framework: 'Tailwind CSS',
			description:
				'Команда збирає адаптивні лендинги та демо на Tailwind і працює з найбільшою кількістю активних сайтів.',
			highlights: [
				'Спільні репозиторії: theme-tailwind, itkamianets.com',
				'Сильний блок доменних проєктів із короткими циклами оновлень',
			],
			developers: [
				{
					username: 'andre20122002',
					fullName: 'Андрій Данильчук',
					projects: getProjectNamesFor('andre20122002'),
				},
				{
					username: 'VadimValcerKN1B22',
					fullName: 'Вадим Вальцер',
					projects: getProjectNamesFor('VadimValcerKN1B22'),
				},
				{
					username: 'Keyd8n',
					fullName: 'Дмитро Демченко',
					projects: getProjectNamesFor('Keyd8n'),
				},
			],
		},
		{
			id: 'bootstrap',
			name: 'Bootstrap team',
			framework: 'Bootstrap',
			description:
				'Команда працює з класичними багатосторінковими макетами, швидко збирає структуру та доводить сторінки до стабільного демо.',
			highlights: [
				'Базова тема: theme-bootstrap',
				'Велика частка комерційних та промо-сайтів у репозиторіях',
			],
			developers: [
				{
					username: 'Na1ld',
					fullName: 'Віктор Окряк',
					projects: getProjectNamesFor('Na1ld'),
				},
				{
					username: 's1a6ks',
					fullName: 'Рома Шулепко',
					projects: getProjectNamesFor('s1a6ks'),
				},
				{
					username: 'VladLevchuk2009',
					fullName: 'Владислав Левчук',
					projects: getProjectNamesFor('VladLevchuk2009'),
				},
			],
		},
		{
			id: 'bulma',
			name: 'Bulma team',
			framework: 'Bulma',
			description:
				'Команда веде інтерфейси на Bulma, тримає стабільний темп релізів і показує широкий набір нішевих проєктів.',
			highlights: [
				'Базова тема: theme-bulma',
				'Окремі продуктові сайти оновлювалися до самого фіналу хакатону',
			],
			developers: [
				{
					username: 'Vyluk',
					fullName: 'Роман Шулепко',
					projects: getProjectNamesFor('Vyluk'),
				},
				{
					username: 'AnatoliyKN1B22',
					fullName: 'Анатолій Гумельник',
					projects: getProjectNamesFor('AnatoliyKN1B22'),
				},
				{
					username: 'ValeryMakush',
					fullName: 'Валерія Макуш',
					projects: getProjectNamesFor('ValeryMakush'),
				},
			],
		},
	],
};
