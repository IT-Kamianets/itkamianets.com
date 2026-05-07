import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TEAM_MEMBERS, TeamMember } from '../../../../data/team.data';
import { Project } from '../../project.interface';
import { ProjectService } from '../../project.service';

@Component({
	selector: 'app-projects',
	templateUrl: './projects.component.html',
	styleUrl: './projects.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
	private readonly _projectService = inject(ProjectService);
	readonly projects = signal<Project[]>([]);
	readonly teamMembers = TEAM_MEMBERS;

	constructor() {
		this._loadProjects();
	}

	getImageSrc(project: Project): string {
		const image = project.data.photo;
		if (!image) {
			return 'project/ai-lab.itkamianets.com.png';
		}

		return project.data.imageKind === 'upload' ? image : `project/${image}.png`;
	}

	getProjectMembers(project: Project): TeamMember[] {
		const teamIds = Array.isArray(project.data.team) ? project.data.team : [];
		return teamIds
			.map((id) => this.teamMembers.find((member) => member.id === id))
			.filter((member): member is TeamMember => Boolean(member));
	}

	trackByProjectId(index: number, project: Project): string {
		return project._id || String(index);
	}

	private _loadProjects(): void {
		this._projectService.getAll().subscribe({
			next: (projects) => this.projects.set(Array.isArray(projects) ? projects : []),
			error: () => this.projects.set([]),
		});
	}
}
