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
	readonly proposals: Proposal[] = PROPOSALS.map((proposal) => ({
		...proposal,
		team: proposal.team.map((member) => ({
			...member,
			role: this._roleLabel(member.role),
		})),
	}));
	readonly categories: string[] = ['Усі', ...CATEGORIES];
	activeCategory = 0;
	proposalSlideIndex = 0;
	proposalsVisible = 3;
	proposalScrollStep = 2;

	readonly allTeam: TeamMember[] = TEAM_MEMBERS.map((member) => ({
		...member,
		role: this._roleLabel(member.role),
	}));
	teamSlideIndex = 0;
	teamVisible = 3;
	teamScrollStep = 2;

	readonly allProjects: Project[] = PROJECTS.map((project) => ({
		...project,
		tags: project.tags.map((tag) => this._projectTagLabel(tag)),
	}));
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
			this.proposalsVisible = 1;
			this.proposalScrollStep = 1;
			this.teamVisible = 1;
			this.teamScrollStep = 1;
			this.projectsVisible = 1;
			this.projectsScrollStep = 1;
		} else if (width < 1024) {
			this.proposalsVisible = 2;
			this.proposalScrollStep = 1;
			this.teamVisible = 2;
			this.teamScrollStep = 1;
			this.projectsVisible = 2;
			this.projectsScrollStep = 1;
		} else {
			this.proposalsVisible = 3;
			this.proposalScrollStep = 2;
			this.teamVisible = 3;
			this.teamScrollStep = 2;
			this.projectsVisible = 3;
			this.projectsScrollStep = 2;
		}

		const propCount = this.currentCategoryProposals.length;
		const maxPropIndex = Math.max(0, propCount - this.proposalsVisible);
		if (this.proposalSlideIndex > maxPropIndex) {
			this.proposalSlideIndex = maxPropIndex;
		}

		const teamCount = this.allTeam.length;
		const maxTeamIndex = Math.max(0, teamCount - this.teamVisible);
		if (this.teamSlideIndex > maxTeamIndex) {
			this.teamSlideIndex = maxTeamIndex;
		}

		const projCount = this.allProjects.length;
		const maxProjIndex = Math.max(0, projCount - this.projectsVisible);
		if (this.projectSlideIndex > maxProjIndex) {
			this.projectSlideIndex = maxProjIndex;
		}
	}

	get currentCategoryProposals() {
		if (this.categories[this.activeCategory] === 'Усі') {
			return this.proposals;
		}
		return this.proposals.filter((p) => p.category === this.categories[this.activeCategory]);
	}

	get proposalDots() {
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

	selectCategory(index: number) {
		this.activeCategory = index;
		this.proposalSlideIndex = 0;
	}

	prevProposal() {
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

	nextProposal() {
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

	setProposalSlide(index: number) {
		this.proposalSlideIndex = index;
	}

	isDotActive(dotValue: number) {
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

	get teamDots() {
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

	prevTeam() {
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

	nextTeam() {
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

	setTeamSlide(index: number) {
		this.teamSlideIndex = index;
	}

	isTeamDotActive(dotValue: number) {
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

	get projectDots() {
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

	prevProject() {
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

	nextProject() {
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

	setProjectSlide(index: number) {
		this.projectSlideIndex = index;
	}

	isProjectDotActive(dotValue: number) {
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

	categoryLabel(cat: string) {
		switch (cat) {
			case 'theme-tailwind':
				return 'Тема Tailwind';
			case 'theme-bulma':
				return 'Тема Bulma';
			case 'theme-bootstrap':
				return 'Тема Bootstrap';
			default:
				return cat;
		}
	}

	private _roleLabel(role: string) {
		switch (role) {
			case 'Head of Team / Full-stack Developer':
				return 'Керівник команди / Фулстек-розробник';
			case 'Frontend Developer':
				return 'Фронтенд-розробник';
			case 'UI/UX Designer':
				return 'UI/UX дизайнер';
			case 'Full-stack':
				return 'Фулстек';
			case 'Frontend':
				return 'Фронтенд';
			default:
				return role;
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
