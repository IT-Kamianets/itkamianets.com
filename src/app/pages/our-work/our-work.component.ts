import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANIES } from '../../data/companies.data';
import { HACKATHONS } from '../../data/hackathons.data';
import { PROJECTS } from '../../data/projects.data';

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

	protected readonly hackathons = HACKATHONS;

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
