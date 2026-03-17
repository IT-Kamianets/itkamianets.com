import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BUSINESS_TYPES, BUSINESSES, Business } from '../../data/businesses.data';

@Component({
	selector: 'app-businesses',
	imports: [RouterLink, FormsModule],
	templateUrl: './businesses.component.html',
	styleUrl: './businesses.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessesComponent {
	readonly businesses: Business[] = BUSINESSES;
	readonly types: string[] = BUSINESS_TYPES;

	activeType = signal<string>('All');
	searchQuery = signal<string>('');
	sortBy = signal<'name' | 'founded' | 'employees'>('name');

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		title: Title,
		meta: Meta,
	) {
		title.setTitle("Бізнеси Кам'янця | IT-Kamianets");
		meta.updateTag({
			name: 'description',
			content: "Каталог IT-компаній Кам'янця-Подільського — студії, аутсорс, продуктові та агентства. Технології, послуги, контакти.",
		});

		// Restore state from URL on init
		const params = this.route.snapshot.queryParamMap;
		const type = params.get('type');
		const q = params.get('q');
		const sort = params.get('sort') as 'name' | 'founded' | 'employees' | null;

		if (type && [...BUSINESS_TYPES, 'All'].includes(type)) this.activeType.set(type);
		if (q) this.searchQuery.set(q);
		if (sort && ['name', 'founded', 'employees'].includes(sort)) this.sortBy.set(sort);

		// Sync signals → URL
		effect(() => {
			const type = this.activeType();
			const q = this.searchQuery();
			const sort = this.sortBy();

			this.router.navigate([], {
				queryParams: {
					type: type !== 'All' ? type : null,
					q: q || null,
					sort: sort !== 'name' ? sort : null,
				},
				queryParamsHandling: 'merge',
				replaceUrl: true,
			});
		});
	}

	setFilter(type: string): void {
		this.activeType.set(type);
	}

	readonly filteredBusinesses = computed<Business[]>(() => {
		const type = this.activeType();
		const query = this.searchQuery().toLowerCase().trim();
		const sort = this.sortBy();

		let result = this.businesses;

		if (type !== 'All') {
			result = result.filter((b) => b.type === type);
		}

		if (query) {
			result = result.filter(
				(b) =>
					b.name.toLowerCase().includes(query) ||
					b.techStack.some((t) => t.toLowerCase().includes(query)) ||
					b.services.some((s) => s.toLowerCase().includes(query)),
			);
		}

		return [...result].sort((a, b) => {
			if (sort === 'name') return a.name.localeCompare(b.name, 'uk');
			if (sort === 'founded') return a.founded - b.founded;
			if (sort === 'employees') return b.employees - a.employees;
			return 0;
		});
	});
}
