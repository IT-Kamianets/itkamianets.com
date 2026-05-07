export interface TeamMember {
	id: number;
	name: string;
	role: string;
	avatar: string;
	internshipDates: string;
	university: string;
	isHead: boolean;
	socials: {
		linkedin: string;
		github: string;
		upwork: string;
	};
}

export const TEAM_MEMBERS: TeamMember[] = [
	{
		id: 1,
		name: 'Гончар Денис',
		role: 'Head of Team / Full-stack Developer',
		avatar: 'Honchar_Denys',
		internshipDates: 'Вер 2024 – Теперішній час',
		university: 'Web Art Work',
		isHead: true,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 2,
		name: 'Вальцер Вадим',
		role: 'Frontend Developer',
		avatar: 'Vadim_Valtser',
		internshipDates: 'Жов 2024 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 3,
		name: 'Гумельник Анатолій',
		role: 'Frontend Developer',
		avatar: 'Anatoliy',
		internshipDates: 'Жов 2024 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 4,
		name: 'Окряк Віктор',
		role: 'Frontend Developer',
		avatar: 'Na1ld',
		internshipDates: 'Лис 2024 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 5,
		name: 'Демчина Дмитро',
		role: 'Frontend Developer',
		avatar: 'Dmytro_Demchenko',
		internshipDates: 'Лис 2024 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 6,
		name: 'Шулепко Роман',
		role: 'Frontend Developer',
		avatar: 'Roman_Shulepko',
		internshipDates: 'Гру 2024 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 7,
		name: 'Данильчук Андрій',
		role: 'Frontend Developer',
		avatar: 'andre',
		internshipDates: 'Січ 2025 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 8,
		name: 'Левчук Владислав',
		role: 'Frontend Developer',
		avatar: 'VladLevchuk',
		internshipDates: 'Січ 2025 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 9,
		name: 'Макуш Валерія',
		role: 'UI/UX Designer',
		avatar: 'Valery_Makush',
		internshipDates: 'Лют 2025 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
	{
		id: 10,
		name: 'Горецький Максим',
		role: 'Frontend Developer',
		avatar: 'Horetskyi_Maksym',
		internshipDates: 'Лют 2025 – Теперішній час',
		university: 'К-ПНУ ім. Івана Огієнка',
		isHead: false,
		socials: { linkedin: '#', github: '#', upwork: '#' },
	},
];
