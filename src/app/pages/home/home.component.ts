import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	Inject,
	OnInit,
	PLATFORM_ID,
	inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Item } from '../../feature/item/item.interface';
import { ItemService } from '../../feature/item/item.service';
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
	private readonly itemService = inject(ItemService);

	private readonly fallbackProposals = PROPOSALS;
	private readonly fallbackCategories = ['Усі', ...CATEGORIES];
	private readonly fallbackProjects = PROJECTS;
	/** ProposalsComponent carousel */
	proposals: Proposal[] = [...PROPOSALS];
	categories: string[] = ['Усі', ...CATEGORIES];
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
	allProjects: Project[] = [...PROJECTS];
	projectSlideIndex = 0;
	projectsVisible = 3;
	projectsScrollStep = 2;

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			this.updateResponsiveConfig();
		}

		this.loadLandingItems();
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

	private loadLandingItems(): void {
		this.itemService.get().subscribe({
			next: (items) => {
				this.applyLandingItems(items);
			},
			error: () => {
				this.proposals = [...this.fallbackProposals];
				this.categories = [...this.fallbackCategories];
				this.allProjects = [...this.fallbackProjects];
			},
		});
	}

	private applyLandingItems(items: Item[]): void {
		const proposals = this.mapProposals(items);
		const projects = this.mapProjects(items);

		if (proposals.length) {
			this.proposals = proposals;
			this.categories = this.buildCategories(proposals);
			this.activeCategory = 0;
			this.proposalSlideIndex = 0;
		} else {
			this.proposals = [...this.fallbackProposals];
			this.categories = [...this.fallbackCategories];
		}

		if (projects.length) {
			this.allProjects = projects;
			this.projectSlideIndex = 0;
		} else {
			this.allProjects = [...this.fallbackProjects];
		}

		if (isPlatformBrowser(this.platformId)) {
			this.updateResponsiveConfig();
		}
	}

	private mapProposals(items: Item[]): Proposal[] {
		const proposals = items
			.filter((item) => this.isProposalItem(item))
			.map((item, index) => this.toProposal(item, index + 1))
			.filter((item): item is Proposal => Boolean(item));

		return proposals.sort((a, b) => a.id - b.id);
	}

	private mapProjects(items: Item[]): Project[] {
		const projects = items
			.filter((item) => this.isProjectItem(item))
			.map((item, index) => this.toProject(item, index + 1))
			.filter((item): item is Project => Boolean(item));

		return projects.sort((a, b) => a.id - b.id);
	}

	private buildCategories(proposals: Proposal[]): string[] {
		const unique = Array.from(
			new Set(proposals.map((p) => p.category).filter((c) => c && c.trim().length)),
		);
		return [this.fallbackCategories[0], ...unique];
	}

	private isProposalItem(item: Item): boolean {
		const data = this.asRecord(item.data);
		return this.matchesKind(data, ['proposal', 'proposals', 'service', 'services', 'offer']);
	}

	private isProjectItem(item: Item): boolean {
		const data = this.asRecord(item.data);
		return this.matchesKind(data, ['project', 'projects', 'portfolio', 'gallery']);
	}

	private matchesKind(source: Record<string, unknown>, tokens: string[]): boolean {
		const type = this.pickString(source, ['type', 'kind', 'contentType']);
		const section = this.pickString(source, ['section', 'block', 'area', 'group']);
		const category = this.pickString(source, ['category', 'tag']);
		return (
			this.matchToken(type, tokens) ||
			this.matchToken(section, tokens) ||
			this.matchToken(category, tokens)
		);
	}

	private matchToken(value: string | null, tokens: string[]): boolean {
		if (!value) return false;
		const normalized = value.toLowerCase();
		return tokens.some((token) => normalized === token || normalized.includes(token));
	}

	private toProposal(item: Item, fallbackId: number): Proposal | null {
		const data = this.asRecord(item.data);
		const title = this.pickString(data, ['title', 'name', 'headline']);
		if (!title) return null;

		return {
			id: this.pickNumber(data, ['id', 'order', 'position']) ?? fallbackId,
			title,
			shortDescription:
				this.pickString(data, ['shortDescription', 'summary', 'excerpt', 'subtitle']) ??
				'',
			fullDescription:
				this.pickString(data, ['fullDescription', 'description', 'body']) ?? '',
			category: this.pickString(data, ['category', 'segment', 'typeLabel']) ?? 'Лендінг',
			image:
				this.pickString(data, ['image', 'cover', 'thumbnail', 'hero']) ?? 'logo.png',
			features: this.pickStringArray(data, ['features', 'highlights', 'bullets']),
			team: this.pickTeamArray(data, ['team', 'people', 'members']),
			priceFrom: this.pickNumber(data, ['priceFrom', 'minPrice', 'from']) ?? 0,
			priceTo: this.pickNumber(data, ['priceTo', 'maxPrice', 'to']) ?? 0,
			timeFrom: this.pickNumber(data, ['timeFrom', 'minTime', 'durationFrom']) ?? 0,
			timeTo: this.pickNumber(data, ['timeTo', 'maxTime', 'durationTo']) ?? 0,
		};
	}

	private toProject(item: Item, fallbackId: number): Project | null {
		const data = this.asRecord(item.data);
		const title = this.pickString(data, ['title', 'name']);
		if (!title) return null;

		const category = this.normalizeProjectCategory(
			this.pickString(data, ['category', 'theme', 'type']) ?? '',
		);
		return {
			id: this.pickNumber(data, ['id', 'order', 'position']) ?? fallbackId,
			title,
			description: this.pickString(data, ['description', 'summary']) ?? '',
			category,
			repoUrl: this.pickString(data, ['repoUrl', 'repo', 'github']) ?? '',
			liveUrl: this.pickString(data, ['liveUrl', 'url', 'link']) ?? '',
			tags: this.pickStringArray(data, ['tags', 'stack', 'skills']),
			image: this.pickString(data, ['image', 'cover', 'thumbnail']) ?? '',
		};
	}

	private normalizeProjectCategory(input: string): Project['category'] {
		const value = input.toLowerCase();
		if (value.includes('bulma')) return 'theme-bulma';
		if (value.includes('bootstrap')) return 'theme-bootstrap';
		return 'theme-tailwind';
	}

	projectImage(project: Project): string {
		const image = project.image?.trim();
		if (!image) return 'logo.png';
		if (image.startsWith('http') || image.startsWith('/')) {
			return image;
		}
		return `project/${image}.png`;
	}

	private asRecord(value: unknown): Record<string, unknown> {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			return {};
		}

		return value as Record<string, unknown>;
	}

	private pickString(source: Record<string, unknown>, keys: string[]): string | null {
		for (const key of keys) {
			const value = source[key];
			if (typeof value === 'string' && value.trim().length) {
				return value.trim();
			}
		}

		return null;
	}

	private pickNumber(source: Record<string, unknown>, keys: string[]): number | null {
		for (const key of keys) {
			const value = source[key];
			if (typeof value === 'number' && Number.isFinite(value)) {
				return value;
			}
			if (typeof value === 'string' && value.trim().length) {
				const parsed = Number(value);
				if (Number.isFinite(parsed)) {
					return parsed;
				}
			}
		}

		return null;
	}

	private pickStringArray(source: Record<string, unknown>, keys: string[]): string[] {
		for (const key of keys) {
			const value = source[key];
			if (Array.isArray(value)) {
				return value.filter((entry): entry is string => typeof entry === 'string');
			}
			if (typeof value === 'string' && value.trim().length) {
				return value.split(',').map((entry) => entry.trim()).filter(Boolean);
			}
		}

		return [];
	}

	private pickTeamArray(
		source: Record<string, unknown>,
		keys: string[],
	): { name: string; avatar: string; role: string }[] {
		for (const key of keys) {
			const value = source[key];
			if (Array.isArray(value)) {
				return value
					.map((entry) => {
						if (!entry || typeof entry !== 'object') {
							return null;
						}
						const record = entry as Record<string, unknown>;
						const name = this.pickString(record, ['name', 'title']);
						const avatar = this.pickString(record, ['avatar', 'image', 'photo']) ?? '';
						const role = this.pickString(record, ['role', 'position']) ?? '';
						if (!name) return null;
						return { name, avatar, role };
					})
					.filter(
						(entry): entry is { name: string; avatar: string; role: string } =>
							Boolean(entry),
					);
			}
		}

		return [];
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



