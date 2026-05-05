import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS_CATALOG } from '../../data/projects-catalog.data';

@Component({
	templateUrl: './projects.component.html',
	styleUrl: './projects.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
	protected readonly projects = PROJECTS_CATALOG;
}
