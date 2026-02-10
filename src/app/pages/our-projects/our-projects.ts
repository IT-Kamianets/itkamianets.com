import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompletedProject, COMPLETED_PROJECTS, PROJECT_CATEGORIES } from '../../data/projects.data';

@Component({
	selector: 'app-our-projects',
	imports: [RouterLink],
	templateUrl: './our-projects.html',
	styleUrl: './our-projects.css',
})
export class OurProjects {
	readonly projects = COMPLETED_PROJECTS;
	readonly categories = PROJECT_CATEGORIES;
	selectedCategory = signal('Усі');
	selectedProject = signal<CompletedProject | null>(null);

	filteredProjects = computed(() => {
		const cat = this.selectedCategory();
		if (cat === 'Усі') return this.projects;
		return this.projects.filter(p => p.category === cat);
	});

	selectCategory(cat: string): void {
		this.selectedCategory.set(cat);
	}

	openProject(project: CompletedProject): void {
		this.selectedProject.set(project);
		document.body.style.overflow = 'hidden';
	}

	closeProject(): void {
		this.selectedProject.set(null);
		document.body.style.overflow = '';
	}

	formatStars(rating: number): string[] {
		return Array(rating).fill('★');
	}
}

