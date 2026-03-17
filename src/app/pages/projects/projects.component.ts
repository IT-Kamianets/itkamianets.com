import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProjectService } from '../../feature/project/project.service';
import { ManagedProject } from '../../feature/project/project.interface';

@Component({
	selector: 'app-projects',
	imports: [NgClass],
	templateUrl: './projects.component.html',
	styleUrl: './projects.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
	private readonly _projectService = inject(ProjectService);

	readonly projects = computed(() => this._projectService.projects());

	getImageSrc(project: ManagedProject): string {
		return project.imageKind === 'upload' ? project.image : `project/${project.image}.png`;
	}

	getBadgeLabel(project: ManagedProject): string {
		switch (project.category) {
			case 'theme-tailwind':
				return 'Tailwind';
			case 'theme-bulma':
				return 'Bulma';
			case 'theme-bootstrap':
				return 'Bootstrap';
			default:
				return 'Project';
		}
	}

	getBadgeClass(project: ManagedProject): string {
		switch (project.category) {
			case 'theme-tailwind':
				return 'project-card__badge--tailwind';
			case 'theme-bulma':
				return 'project-card__badge--bulma';
			case 'theme-bootstrap':
				return 'project-card__badge--bootstrap';
			default:
				return 'project-card__badge--custom';
		}
	}
}
