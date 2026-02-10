import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Proposal, PROPOSALS, CATEGORIES } from '../../data/proposals.data';

@Component({
	selector: 'app-proposals',
	imports: [RouterLink],
	templateUrl: './proposals.html',
	styleUrl: './proposals.css',
})
export class Proposals {
	readonly proposals = PROPOSALS;
	readonly categories = CATEGORIES;
	readonly selectedCategory = signal('Усі');
	readonly selectedProposal = signal<Proposal | null>(null);

	readonly filteredProposals = computed(() => {
		const cat = this.selectedCategory();
		return cat === 'Усі' ? this.proposals : this.proposals.filter(p => p.category === cat);
	});

	filterByCategory(cat: string): void {
		this.selectedCategory.set(cat);
	}

	openProposal(p: Proposal): void {
		this.selectedProposal.set(p);
		document.body.style.overflow = 'hidden';
	}

	closeProposal(): void {
		this.selectedProposal.set(null);
		document.body.style.overflow = '';
	}

	formatPrice(n: number): string {
		return n.toLocaleString('uk-UA');
	}
}
