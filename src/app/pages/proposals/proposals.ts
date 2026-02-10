import { Component, signal, computed, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Proposal, PROPOSALS, CATEGORIES } from '../../data/proposals.data';
import { TEAM_MEMBERS, TeamMemberFull } from '../../data/team.data';
import { CompletedProject, COMPLETED_PROJECTS } from '../../data/projects.data';

@Component({
	selector: 'app-proposals',
	imports: [RouterLink],
	templateUrl: './proposals.html',
	styleUrl: './proposals.css',
})
export class Proposals implements OnInit {
	private readonly route = inject(ActivatedRoute);
	private readonly destroyRef = inject(DestroyRef);

	readonly proposals = PROPOSALS;
	readonly categories = CATEGORIES;
	readonly teamMembers = TEAM_MEMBERS;
	readonly completedProjects = COMPLETED_PROJECTS;
	readonly selectedCategory = signal('Усі');
	readonly selectedProposal = signal<Proposal | null>(null);
	readonly selectedMember = signal<TeamMemberFull | null>(null);
	readonly selectedProjectModal = signal<CompletedProject | null>(null);
	private modalStack = signal<Array<{type: 'proposal' | 'project' | 'team', data: any}>>([]);

	readonly filteredProposals = computed(() => {
		const cat = this.selectedCategory();
		return cat === 'Усі' ? this.proposals : this.proposals.filter(p => p.category === cat);
	});

	ngOnInit(): void {
		this.route.queryParamMap
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(params => {
				const cat = params.get('category');
				if (cat && this.categories.includes(cat)) {
					this.selectedCategory.set(cat);
				}
			});
	}

	filterByCategory(cat: string): void {
		this.selectedCategory.set(cat);
	}

	openProposal(p: Proposal): void {
		this.modalStack.set([]);
		this.selectedProposal.set(p);
		document.body.style.overflow = 'hidden';
	}

	closeProposal(): void {
		this.selectedProposal.set(null);
		this.popFromStack();
	}

	formatPrice(n: number): string {
		return n.toLocaleString('uk-UA');
	}

	formatStars(rating: number): string[] {
		return Array(rating).fill('★');
	}

	/* ── Cross-modal navigation ── */
	openMemberByName(name: string): void {
		const member = this.teamMembers.find(m => m.name === name);
		if (member) {
			this.pushCurrentToStack();
			this.selectedMember.set(member);
			document.body.style.overflow = 'hidden';
		}
	}

	closeMember(): void {
		this.selectedMember.set(null);
		this.popFromStack();
	}

	openProjectByTitle(title: string): void {
		const project = this.completedProjects.find(p => p.title === title);
		if (project) {
			this.pushCurrentToStack();
			this.selectedProjectModal.set(project);
			document.body.style.overflow = 'hidden';
		}
	}

	closeProjectModal(): void {
		this.selectedProjectModal.set(null);
		this.popFromStack();
	}

	openProposalByTitle(title: string): void {
		const proposal = this.proposals.find(p => p.title === title);
		if (proposal) {
			this.pushCurrentToStack();
			this.selectedProposal.set(proposal);
			document.body.style.overflow = 'hidden';
		}
	}

	getProposalsForMember(name: string): Proposal[] {
		return this.proposals.filter(p => p.team.some(m => m.name === name));
	}

	getCompletedProjectsForMember(name: string): CompletedProject[] {
		return this.completedProjects.filter(p => p.team.some(m => m.name === name));
	}

	hasStack(): boolean {
		return this.modalStack().length > 0;
	}

	closeAll(): void {
		this.selectedProposal.set(null);
		this.selectedMember.set(null);
		this.selectedProjectModal.set(null);
		this.modalStack.set([]);
		document.body.style.overflow = '';
	}

	private pushCurrentToStack(): void {
		const proposal = this.selectedProposal();
		const project = this.selectedProjectModal();
		const member = this.selectedMember();
		if (proposal) {
			this.modalStack.update(s => [...s, { type: 'proposal', data: proposal }]);
			this.selectedProposal.set(null);
		} else if (project) {
			this.modalStack.update(s => [...s, { type: 'project', data: project }]);
			this.selectedProjectModal.set(null);
		} else if (member) {
			this.modalStack.update(s => [...s, { type: 'team', data: member }]);
			this.selectedMember.set(null);
		}
	}

	private popFromStack(): void {
		const stack = this.modalStack();
		if (stack.length > 0) {
			const prev = stack[stack.length - 1];
			this.modalStack.update(s => s.slice(0, -1));
			if (prev.type === 'proposal') this.selectedProposal.set(prev.data);
			else if (prev.type === 'project') this.selectedProjectModal.set(prev.data);
			else if (prev.type === 'team') this.selectedMember.set(prev.data);
		} else {
			document.body.style.overflow = '';
		}
	}
}
