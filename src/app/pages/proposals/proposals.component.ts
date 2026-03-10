import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CATEGORIES, PROPOSALS, Proposal } from '../../data/proposals.data';

@Component({
	selector: 'app-proposals',
	imports: [DecimalPipe],
	templateUrl: './proposals.component.html',
	styleUrl: './proposals.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalsComponent {
	readonly proposals: Proposal[] = PROPOSALS;
	readonly categories: string[] = CATEGORIES;
	activeCategory = signal<string>('All');

	constructor(private route: ActivatedRoute) {
		this.route.queryParams.subscribe((params) => {
			if (params['category'] && this.categories.includes(params['category'])) {
				this.activeCategory.set(params['category']);
			}
		});
	}

	setFilter(category: string): void {
		this.activeCategory.set(category);
	}

	get filteredProposals(): Proposal[] {
		const cat = this.activeCategory();
		if (cat === 'All') return this.proposals;
		return this.proposals.filter((p) => p.category === cat);
	}
}
