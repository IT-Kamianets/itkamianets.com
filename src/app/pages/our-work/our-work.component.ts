import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANIES } from '../../data/companies.data';
import { PROJECTS } from '../../data/projects.data';

interface WorkHackathon {
	id: number;
	title: string;
	url: string;
	format: string;
	description: string;
	stack: string[];
	period: string;
}

interface WorkPartner {
	id: string;
	name: string;
	url: string;
	label: string;
	description: string;
	services: string[];
}

@Component({
	imports: [RouterLink],
	templateUrl: './our-work.component.html',
	styleUrl: './our-work.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurWorkComponent {
	protected readonly projects = PROJECTS.slice(0, 3).map((project) => ({
		...project,
		url: project.image,
		category: this._projectCategoryLabel(project.category),
		tags: project.tags.map((tag) => this._projectTagLabel(tag)),
	}));

	protected readonly businesses = COMPANIES.slice(0, 3);

	protected readonly hackathons: WorkHackathon[] = [
		{
			id: 1,
			title: 'Змагання фронтенд-спринту',
			url: 'frontend-sprint',
			format: 'Командне змагання',
			description:
				'Короткий цикл розробки, у якому команди збирають промо-сайти, тестують ідеї та презентують готове демо.',
			stack: ['Angular', 'Tailwind', 'UI Kit'],
			period: 'Березень 2026',
		},
		{
			id: 2,
			title: 'Змагання демонстрації продуктів',
			url: 'product-demo-day',
			format: 'Прототипування',
			description:
				'Учасники готують MVP сервісів для локального бізнесу, проходять рев’ю і захищають рішення перед партнерами.',
			stack: ['Дослідження', 'UX', 'Фронтенд'],
			period: 'Квітень 2026',
		},
		{
			id: 3,
			title: 'Змагання практики Web Art Work',
			url: 'web-art-work-practice',
			format: 'Внутрішня практика',
			description:
				'Три напрямки розробки працюють паралельно над різними підходами до запуску сайтів і показують результат у фіналі.',
			stack: ['Tailwind', 'Bootstrap', 'Bulma'],
			period: 'Травень 2026',
		},
	];

	protected readonly partners: WorkPartner[] = [
		{
			id: 'it-kamianets',
			name: 'IT Kamianets',
			url: 'it-kamianets',
			label: 'Технологічний партнер',
			description:
				'Команда, яка веде цифрові продукти, сайт платформи, спільні ініціативи та партнерські веб-рішення.',
			services: ['Веб-розробка', 'Підтримка продуктів', 'Технічний супровід'],
		},
		{
			id: 'web-art-work',
			name: 'Web Art Work',
			url: 'web-art-work',
			label: 'Дизайн і продакшн',
			description:
				'Напрямок, сфокусований на дизайні, презентаційних сайтах, брендингу та швидкому запуску нових сторінок.',
			services: ['UI/UX дизайн', 'Лендінги', 'Брендинг'],
		},
		{
			id: 'demo-it',
			name: 'Demo IT',
			url: 'demo-it',
			label: 'Демо та MVP',
			description:
				'Команда для швидкого складання демо-рішень, MVP та тестових запусків перед повною реалізацією сервісів.',
			services: ['MVP', 'Прототипи', 'Запуск демо'],
		},
	];

	private _projectCategoryLabel(category: string) {
		switch (category) {
			case 'theme-tailwind':
				return 'Тема Tailwind';
			case 'theme-bulma':
				return 'Тема Bulma';
			case 'theme-bootstrap':
				return 'Тема Bootstrap';
			default:
				return category;
		}
	}

	private _projectTagLabel(tag: string) {
		switch (tag) {
			case 'Portfolio':
				return 'Портфоліо';
			case 'Responsive':
				return 'Адаптивний';
			default:
				return tag;
		}
	}
}
