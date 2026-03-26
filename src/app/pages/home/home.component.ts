import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	Inject,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS, Project } from '../../data/projects.data';
import { CATEGORIES, PROPOSALS, Proposal } from '../../data/proposals.data';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';

@Component({
	imports: [RouterLink, DecimalPipe],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
	/** ProposalsComponent carousel */
	readonly proposals: Proposal[] = PROPOSALS;
	readonly categories: string[] = ['Усі', ...CATEGORIES];
	activeCategory = 0;
	proposalSlideIndex = 0;
	proposalsVisible = 3;
	proposalScrollStep = 2;

	/** TeamComponent slider */
	readonly allTeam: TeamMember[] = TEAM_MEMBERS;
	teamSlideIndex = 0;
	teamVisible = 3;
	teamScrollStep = 2;

	/** ProjectsComponent slider */
	readonly allProjects: Project[] = PROJECTS;
	projectSlideIndex = 0;
	projectsVisible = 3;
	projectsScrollStep = 2;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			this.updateResponsiveConfig();
		}
	}

	@HostListener('window:resize')
	onResize() {
		if (isPlatformBrowser(this.platformId)) {
			this.updateResponsiveConfig();
		}
	}

	private updateResponsiveConfig() {
		const width = window.innerWidth;
		if (width < 768) {
			// Mobile
			this.proposalsVisible = 1;
			this.proposalScrollStep = 1;

			this.teamVisible = 1;
			this.teamScrollStep = 1;

			this.projectsVisible = 1;
			this.projectsScrollStep = 1;
		} else if (width < 1024) {
			// Tablet
			this.proposalsVisible = 2;
			this.proposalScrollStep = 1;

			this.teamVisible = 2;
			this.teamScrollStep = 1;

			this.projectsVisible = 2;
			this.projectsScrollStep = 1;
		} else {
			// Desktop
			this.proposalsVisible = 3;
			this.proposalScrollStep = 2;

			this.teamVisible = 3;
			this.teamScrollStep = 2;

			this.projectsVisible = 3;
			this.projectsScrollStep = 2;
		}

		// Adjust Proposal Index
		const propCount = this.currentCategoryProposals.length;
		const maxPropIndex = Math.max(0, propCount - this.proposalsVisible);
		if (this.proposalSlideIndex > maxPropIndex) {
			this.proposalSlideIndex = maxPropIndex;
		}

		// Adjust TeamComponent Index
		const teamCount = this.allTeam.length;
		const maxTeamIndex = Math.max(0, teamCount - this.teamVisible);
		if (this.teamSlideIndex > maxTeamIndex) {
			this.teamSlideIndex = maxTeamIndex;
		}

		// Adjust Project Index
		const projCount = this.allProjects.length;
		const maxProjIndex = Math.max(0, projCount - this.projectsVisible);
		if (this.projectSlideIndex > maxProjIndex) {
			this.projectSlideIndex = maxProjIndex;
		}
	}

	get currentCategoryProposals(): Proposal[] {
		if (this.categories[this.activeCategory] === 'Усі') {
			return this.proposals;
		}
		return this.proposals.filter((p) => p.category === this.categories[this.activeCategory]);
	}

	get proposalDots(): number[] {
		const count = this.currentCategoryProposals.length;
		const visible = this.proposalsVisible;
		const step = this.proposalScrollStep;

		if (count <= visible) return [];

		const maxIndex = count - visible;
		const dots = [];
		for (let i = 0; i <= maxIndex; i += step) {
			dots.push(i);
		}
		const lastDot = dots[dots.length - 1];
		if (lastDot < maxIndex) {
			dots.push(maxIndex);
		}
		return dots;
	}

	selectCategory(index: number): void {
		this.activeCategory = index;
		this.proposalSlideIndex = 0;
	}

	prevProposal(): void {
		const dots = this.proposalDots;
		if (dots.length === 0) return;

		const currentDotIndex = dots.findIndex((d) => d === this.proposalSlideIndex);
		if (currentDotIndex > 0) {
			this.proposalSlideIndex = dots[currentDotIndex - 1];
		} else {
			const prevDot = [...dots].reverse().find((d) => d < this.proposalSlideIndex);
			this.proposalSlideIndex = prevDot !== undefined ? prevDot : dots[0];
		}
	}

	nextProposal(): void {
		const dots = this.proposalDots;
		if (dots.length === 0) return;

		const currentDotIndex = dots.findIndex((d) => d === this.proposalSlideIndex);
		if (currentDotIndex !== -1 && currentDotIndex < dots.length - 1) {
			this.proposalSlideIndex = dots[currentDotIndex + 1];
		} else {
			const nextDot = dots.find((d) => d > this.proposalSlideIndex);
			this.proposalSlideIndex = nextDot !== undefined ? nextDot : dots[dots.length - 1];
		}
	}

	setProposalSlide(index: number): void {
		this.proposalSlideIndex = index;
	}

	isDotActive(dotValue: number): boolean {
		const dots = this.proposalDots;
		if (dots.length === 0) return false;

		let closest = dots[0];
		let minDiff = Math.abs(this.proposalSlideIndex - closest);

		for (const val of dots) {
			const diff = Math.abs(this.proposalSlideIndex - val);
			if (diff < minDiff) {
				minDiff = diff;
				closest = val;
			}
		}

		return closest === dotValue;
	}

	/** TeamComponent slider */
	get teamDots(): number[] {
		const count = this.allTeam.length;
		const visible = this.teamVisible;
		const step = this.teamScrollStep;

		if (count <= visible) return [];

		const maxIndex = count - visible;
		const dots = [];
		for (let i = 0; i <= maxIndex; i += step) {
			dots.push(i);
		}
		const lastDot = dots[dots.length - 1];
		if (lastDot < maxIndex) {
			dots.push(maxIndex);
		}
		return dots;
	}

	prevTeam(): void {
		const dots = this.teamDots;
		if (dots.length === 0) return;
		const currentDotIndex = dots.findIndex((d) => d === this.teamSlideIndex);
		if (currentDotIndex > 0) {
			this.teamSlideIndex = dots[currentDotIndex - 1];
		} else {
			const prevDot = [...dots].reverse().find((d) => d < this.teamSlideIndex);
			this.teamSlideIndex = prevDot !== undefined ? prevDot : dots[0];
		}
	}

	nextTeam(): void {
		const dots = this.teamDots;
		if (dots.length === 0) return;
		const currentDotIndex = dots.findIndex((d) => d === this.teamSlideIndex);
		if (currentDotIndex !== -1 && currentDotIndex < dots.length - 1) {
			this.teamSlideIndex = dots[currentDotIndex + 1];
		} else {
			const nextDot = dots.find((d) => d > this.teamSlideIndex);
			this.teamSlideIndex = nextDot !== undefined ? nextDot : dots[dots.length - 1];
		}
	}

	setTeamSlide(index: number): void {
		this.teamSlideIndex = index;
	}

	isTeamDotActive(dotValue: number): boolean {
		const dots = this.teamDots;
		if (dots.length === 0) return false;
		let closest = dots[0];
		let minDiff = Math.abs(this.teamSlideIndex - closest);
		for (const val of dots) {
			const diff = Math.abs(this.teamSlideIndex - val);
			if (diff < minDiff) {
				minDiff = diff;
				closest = val;
			}
		}
		return closest === dotValue;
	}

	/** ProjectsComponent slider */
	get projectDots(): number[] {
		const count = this.allProjects.length;
		const visible = this.projectsVisible;
		const step = this.projectsScrollStep;

		if (count <= visible) return [];

		const maxIndex = count - visible;
		const dots = [];
		for (let i = 0; i <= maxIndex; i += step) {
			dots.push(i);
		}
		const lastDot = dots[dots.length - 1];
		if (lastDot < maxIndex) {
			dots.push(maxIndex);
		}
		return dots;
	}

	prevProject(): void {
		const dots = this.projectDots;
		if (dots.length === 0) return;
		const currentDotIndex = dots.findIndex((d) => d === this.projectSlideIndex);
		if (currentDotIndex > 0) {
			this.projectSlideIndex = dots[currentDotIndex - 1];
		} else {
			const prevDot = [...dots].reverse().find((d) => d < this.projectSlideIndex);
			this.projectSlideIndex = prevDot !== undefined ? prevDot : dots[0];
		}
	}

	nextProject(): void {
		const dots = this.projectDots;
		if (dots.length === 0) return;
		const currentDotIndex = dots.findIndex((d) => d === this.projectSlideIndex);
		if (currentDotIndex !== -1 && currentDotIndex < dots.length - 1) {
			this.projectSlideIndex = dots[currentDotIndex + 1];
		} else {
			const nextDot = dots.find((d) => d > this.projectSlideIndex);
			this.projectSlideIndex = nextDot !== undefined ? nextDot : dots[dots.length - 1];
		}
	}

	setProjectSlide(index: number): void {
		this.projectSlideIndex = index;
	}

	isProjectDotActive(dotValue: number): boolean {
		const dots = this.projectDots;
		if (dots.length === 0) return false;
		let closest = dots[0];
		let minDiff = Math.abs(this.projectSlideIndex - closest);
		for (const val of dots) {
			const diff = Math.abs(this.projectSlideIndex - val);
			if (diff < minDiff) {
				minDiff = diff;
				closest = val;
			}
		}
		return closest === dotValue;
	}

	categoryLabel(cat: string): string {
		switch (cat) {
			case 'theme-tailwind':
				return 'Tailwind';
			case 'theme-bulma':
				return 'Bulma';
			case 'theme-bootstrap':
				return 'Bootstrap';
			default:
				return cat;
		}
	}
}
