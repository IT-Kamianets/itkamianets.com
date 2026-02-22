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
		tags: ['Tailwind', 'Portfolio', 'Responsive'],
		image: 'demchukdenys.itkamianets.com',
	},
	{
		id: 2,
		title: 'MC',
		description: 'Персональний сайт-портфоліо, побудований на Tailwind CSS з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-tailwind',
		repoUrl: 'https://github.com/IT-Kamianets/mc.itkamianets.com',
		liveUrl: 'https://mc.itkamianets.com',
		tags: ['Tailwind', 'Portfolio', 'Responsive'],
		image: 'mc.itkamianets.com',
	},
	{
		id: 3,
		title: 'SemiMed',
		description: 'Персональний сайт-портфоліо, побудований на Tailwind CSS з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-tailwind',
		repoUrl: 'https://github.com/IT-Kamianets/semimed.itkamianets.com',
		liveUrl: 'https://semimed.itkamianets.com',
		tags: ['Tailwind', 'Portfolio', 'Responsive'],
		image: 'semimed.itkamianets.com',
	},
	{
		id: 4,
		title: 'Vernisazh',
		description: 'Персональний сайт-портфоліо, побудований на Tailwind CSS з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-tailwind',
		repoUrl: 'https://github.com/IT-Kamianets/vernisazh.itkamianets.com',
		liveUrl: 'https://vernisazh.itkamianets.com',
		tags: ['Tailwind', 'Portfolio', 'Responsive'],
		image: 'vernisazh.itkamianets.com',
	},
	{
		id: 5,
		title: 'Vilen',
		description: 'Персональний сайт-портфоліо, побудований на Tailwind CSS з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-tailwind',
		repoUrl: 'https://github.com/IT-Kamianets/vilen.itkamianets.com',
		liveUrl: 'https://vilen.itkamianets.com',
		tags: ['Tailwind', 'Portfolio', 'Responsive'],
		image: 'vilen.itkamianets.com',
	},

	// ── Bulma ──
	{
		id: 6,
		title: 'Kudlati',
		description: 'Персональний сайт-портфоліо, побудований на Bulma з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/kudlati.itkamianets.com',
		liveUrl: 'https://kudlati.itkamianets.com',
		tags: ['Bulma', 'Portfolio', 'Responsive'],
		image: 'kudlati.itkamianets.com',
	},
	{
		id: 7,
		title: 'Dog Style',
		description: 'Персональний сайт-портфоліо, побудований на Bulma з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/dog-style.itkamianets.com',
		liveUrl: 'https://dog-style.itkamianets.com',
		tags: ['Bulma', 'Portfolio', 'Responsive'],
		image: 'dog-style.itkamianets.com',
	},
	{
		id: 8,
		title: 'Laznya',
		description: 'Персональний сайт-портфоліо, побудований на Bulma з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/laznya.itkamianets.com',
		liveUrl: 'https://laznya.itkamianets.com',
		tags: ['Bulma', 'Portfolio', 'Responsive'],
		image: 'laznya.itkamianets.com',
	},
	{
		id: 9,
		title: 'AI Lab',
		description: 'Персональний сайт-портфоліо, побудований на Bulma з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/ai-lab.itkamianets.com',
		liveUrl: 'https://ai-lab.itkamianets.com',
		tags: ['Bulma', 'Portfolio', 'Responsive'],
		image: 'ai-lab.itkamianets.com',
	},
	{
		id: 10,
		title: 'Novita',
		description: 'Персональний сайт-портфоліо, побудований на Bulma з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/novita.itkamianets.com',
		liveUrl: 'https://novita.itkamianets.com',
		tags: ['Bulma', 'Portfolio', 'Responsive'],
		image: 'novita.itkamianets.com',
	},
	{
		id: 11,
		title: 'Marlin',
		description: 'Персональний сайт-портфоліо, побудований на Bulma з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bulma',
		repoUrl: 'https://github.com/IT-Kamianets/marlin.itkamianets.com',
		liveUrl: 'https://marlin.itkamianets.com',
		tags: ['Bulma', 'Portfolio', 'Responsive'],
		image: 'marlin.itkamianets.com',
	},

	// ── Bootstrap ──
	{
		id: 12,
		title: 'Monte Kristo',
		description: 'Персональний сайт-портфоліо, побудований на Bootstrap з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bootstrap',
		repoUrl: 'https://github.com/IT-Kamianets/monte-kristo.itkamianets.com',
		liveUrl: 'https://monte-kristo.itkamianets.com',
		tags: ['Bootstrap', 'Portfolio', 'Responsive'],
		image: 'monte-kristo.itkamianets.com',
	},
	{
		id: 13,
		title: 'Dominicana',
		description: 'Персональний сайт-портфоліо, побудований на Bootstrap з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bootstrap',
		repoUrl: 'https://github.com/IT-Kamianets/dominicana.itkamianets.com',
		liveUrl: 'https://dominicana.itkamianets.com',
		tags: ['Bootstrap', 'Portfolio', 'Responsive'],
		image: 'dominicana.itkamianets.com',
	},
	{
		id: 14,
		title: 'Bilya Richky',
		description: 'Персональний сайт-портфоліо, побудований на Bootstrap з адаптивним дизайном та сучасними анімаціями.',
		category: 'theme-bootstrap',
		repoUrl: 'https://github.com/IT-Kamianets/bilya-richky.itkamianets.com',
		liveUrl: 'https://bilya-richky.itkamianets.com',
		tags: ['Bootstrap', 'Portfolio', 'Responsive'],
		image: 'bilya-richky.itkamianets.com',
	},
];
