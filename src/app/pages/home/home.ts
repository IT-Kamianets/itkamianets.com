import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';
import { PROJECTS, Project } from '../../data/projects.data';
import { PROPOSALS, Proposal, CATEGORIES } from '../../data/proposals.data';

@Component({
	imports: [RouterLink, DecimalPipe],
	templateUrl: './home.html',
	styleUrl: './home.css',
})
export class Home {
	/** Proposals carousel */
	readonly proposals: Proposal[] = PROPOSALS;
	readonly categories: string[] = CATEGORIES;
	activeCategory = 0;
	carouselIndex = 0;

	get currentCategoryProposals(): Proposal[] {
		return this.proposals.filter(p => p.category === this.categories[this.activeCategory]);
	}

	get currentProposal(): Proposal {
		const items = this.currentCategoryProposals;
		return items[this.carouselIndex % items.length];
	}

	selectCategory(index: number): void {
		this.activeCategory = index;
		this.carouselIndex = 0;
	}

	prevSlide(): void {
		const len = this.currentCategoryProposals.length;
		this.carouselIndex = (this.carouselIndex - 1 + len) % len;
	}

	nextSlide(): void {
		const len = this.currentCategoryProposals.length;
		this.carouselIndex = (this.carouselIndex + 1) % len;
	}

	/** Team slider */
	readonly allTeam: TeamMember[] = TEAM_MEMBERS;
	teamSlideIndex = 0;
	readonly TEAM_VISIBLE = 3; // Number of visible team members

	get teamMaxIndex(): number {
		return Math.max(0, this.allTeam.length - 1); // Adjusted for correct max index
	}

	get teamDots(): number[] {
		return Array(Math.max(1, this.allTeam.length - this.TEAM_VISIBLE + 1)).fill(0);
	}

	prevTeam(): void {
		this.teamSlideIndex = Math.max(0, this.teamSlideIndex - 1);
	}

	nextTeam(): void {
		this.teamSlideIndex = Math.min(this.allTeam.length - this.TEAM_VISIBLE, this.teamSlideIndex + 1);
	}

	/** Projects slider */
	readonly allProjects: Project[] = PROJECTS;
	projectSlideIndex = 0;
	readonly PROJECTS_VISIBLE = 3; // Number of visible projects

	get projectMaxIndex(): number {
		return Math.max(0, this.allProjects.length - 1); // Adjusted for correct max index
	}

	get projectDots(): number[] {
		return Array(Math.max(1, this.allProjects.length - this.PROJECTS_VISIBLE + 1)).fill(0);
	}

	prevProject(): void {
		this.projectSlideIndex = Math.max(0, this.projectSlideIndex - 1);
	}

	nextProject(): void {
		this.projectSlideIndex = Math.min(this.allProjects.length - this.PROJECTS_VISIBLE, this.projectSlideIndex + 1);
	}

	categoryLabel(cat: string): string {
		switch (cat) {
			case 'theme-tailwind': return 'Tailwind';
			case 'theme-bulma': return 'Bulma';
			case 'theme-bootstrap': return 'Bootstrap';
			default: return cat;
		}
	}
}
