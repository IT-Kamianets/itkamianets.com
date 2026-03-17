import { Injectable, signal, computed } from '@angular/core';
import { Project, PROJECTS } from '../data/projects.data';
import { TEAM_MEMBERS, TeamMember } from '../data/team.data';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	// Signals for managing state locally
	private readonly _projects = signal<Project[]>([...PROJECTS]);
	private readonly _developers = signal<TeamMember[]>([...TEAM_MEMBERS]);

	// Load stored mappings from localStorage if we are in browser
	constructor() {
		try {
			const stored = localStorage.getItem('itkamianets_admin_projects_mapping');
			if (stored) {
				const mappings = JSON.parse(stored) as Record<number, string>;
				// Apply mappings to current projects state
				this._projects.update((projects) =>
					projects.map((p) =>
						mappings[p.id] ? { ...p, authorUsername: mappings[p.id] } : p,
					),
				);
			}
		} catch (e) {
			console.error('Failed to load project mappings', e);
		}
	}

	// Public readonly signals
	readonly projects = this._projects.asReadonly();
	readonly developers = this._developers.asReadonly();

	// Update project's author
	updateProjectAuthor(projectId: number, newAuthorUsername: string) {
		this._projects.update((projects) => {
			const updated = projects.map((p) =>
				p.id === projectId ? { ...p, authorUsername: newAuthorUsername } : p,
			);

			// Save to localStorage
			try {
				const mappings = updated.reduce(
					(acc, p: any) => {
						if (p.authorUsername) {
							acc[p.id] = p.authorUsername;
						}
						return acc;
					},
					{} as Record<number, string>,
				);
				localStorage.setItem(
					'itkamianets_admin_projects_mapping',
					JSON.stringify(mappings),
				);
			} catch (e) {
				console.error('Failed to save project mappings to localStorage', e);
			}

			return updated;
		});
	}
}
