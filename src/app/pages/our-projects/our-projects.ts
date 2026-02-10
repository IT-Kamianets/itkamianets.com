import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompletedProject, COMPLETED_PROJECTS, PROJECT_CATEGORIES } from '../../data/projects.data';
import { TEAM_MEMBERS, TeamMemberFull } from '../../data/team.data';
import { Proposal, PROPOSALS } from '../../data/proposals.data';

@Component({
	selector: 'app-our-projects',
	imports: [RouterLink],
	templateUrl: './our-projects.html',
	styleUrl: './our-projects.css',
})
export class OurProjects {
	readonly projects = COMPLETED_PROJECTS;
	readonly categories = PROJECT_CATEGORIES;
	readonly teamMembers = TEAM_MEMBERS;
	readonly proposals = PROPOSALS;
	selectedCategory = signal('Усі');
	selectedProject = signal<CompletedProject | null>(null);
	selectedMember = signal<TeamMemberFull | null>(null);
	selectedProposal = signal<Proposal | null>(null);
	private modalStack = signal<Array<{type: 'proposal' | 'project' | 'team', data: any}>>([]);

	filteredProjects = computed(() => {
		const cat = this.selectedCategory();
		if (cat === 'Усі') return this.projects;
		return this.projects.filter(p => p.category === cat);
	});

	selectCategory(cat: string): void {
		this.selectedCategory.set(cat);
	}

	openProject(project: CompletedProject): void {
		this.modalStack.set([]);
		this.selectedProject.set(project);
		document.body.style.overflow = 'hidden';
	}

	closeProject(): void {
		this.selectedProject.set(null);
		this.popFromStack();
	}

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
		const project = this.projects.find(p => p.title === title);
		if (project) {
			this.pushCurrentToStack();
			this.selectedProject.set(project);
			document.body.style.overflow = 'hidden';
		}
	}

	openProposalByTitle(title: string): void {
		const proposal = this.proposals.find(p => p.title === title);
		if (proposal) {
			this.pushCurrentToStack();
			this.selectedProposal.set(proposal);
			document.body.style.overflow = 'hidden';
		}
	}

	closeProposal(): void {
		this.selectedProposal.set(null);
		this.popFromStack();
	}

	getProposalsForMember(name: string): Proposal[] {
		return this.proposals.filter(p => p.team.some(m => m.name === name));
	}

	getCompletedProjectsForMember(name: string): CompletedProject[] {
		return this.projects.filter(p => p.team.some(m => m.name === name));
	}

	hasStack(): boolean {
		return this.modalStack().length > 0;
	}

	closeAll(): void {
		this.selectedProject.set(null);
		this.selectedMember.set(null);
		this.selectedProposal.set(null);
		this.modalStack.set([]);
		document.body.style.overflow = '';
	}

	formatPrice(n: number): string {
		return n.toLocaleString('uk-UA');
	}

	formatStars(rating: number): string[] {
		return Array(rating).fill('★');
	}

	private pushCurrentToStack(): void {
		const project = this.selectedProject();
		const member = this.selectedMember();
		const proposal = this.selectedProposal();
		if (project) {
			this.modalStack.update(s => [...s, { type: 'project', data: project }]);
			this.selectedProject.set(null);
		} else if (member) {
			this.modalStack.update(s => [...s, { type: 'team', data: member }]);
			this.selectedMember.set(null);
		} else if (proposal) {
			this.modalStack.update(s => [...s, { type: 'proposal', data: proposal }]);
			this.selectedProposal.set(null);
		}
	}

	private popFromStack(): void {
		const stack = this.modalStack();
		if (stack.length > 0) {
			const prev = stack[stack.length - 1];
			this.modalStack.update(s => s.slice(0, -1));
			if (prev.type === 'project') this.selectedProject.set(prev.data);
			else if (prev.type === 'team') this.selectedMember.set(prev.data);
			else if (prev.type === 'proposal') this.selectedProposal.set(prev.data);
		} else {
			document.body.style.overflow = '';
		}
	}
}

