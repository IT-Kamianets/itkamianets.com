import { Component } from '@angular/core';
import { Project, PROJECTS } from '../../data/projects.data';

@Component({
	selector: 'app-projects',
	templateUrl: './projects.html',
	styleUrl: './projects.css',
})
export class Projects {
	readonly projects = PROJECTS;

	get tailwindProjects(): Project[] {
		return this.projects.filter(p => p.category === 'theme-tailwind');
	}

	get bulmaProjects(): Project[] {
		return this.projects.filter(p => p.category === 'theme-bulma');
	}

	get bootstrapProjects(): Project[] {
		return this.projects.filter(p => p.category === 'theme-bootstrap');
	}

	getCategoryLabel(cat: string): string {
		switch (cat) {
			case 'theme-tailwind': return 'Tailwind CSS';
			case 'theme-bulma': return 'Bulma';
			case 'theme-bootstrap': return 'Bootstrap';
			default: return cat;
		}
	}
}
