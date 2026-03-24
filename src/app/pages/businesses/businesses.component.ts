import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BUSINESS_TYPES, Business } from '../../feature/business/business.interface';
import { BusinessService } from '../../feature/business/business.service';

@Component({
	selector: 'app-businesses',
	imports: [RouterLink, FormsModule],
	templateUrl: './businesses.component.html',
	styleUrl: './businesses.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessesComponent {
	private businessService = inject(BusinessService);
	readonly businesses = this.businessService.businesses;
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
		meta.updateTag({ property: 'og:title', content: "Бізнеси Кам'янця | IT-Kamianets" });
		meta.updateTag({ property: 'og:description', content: "Каталог IT-компаній Кам'янця-Подільського — студії, аутсорс, продуктові та агентства." });
		meta.updateTag({ property: 'og:type', content: 'website' });

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

	private matchesQuery(business: Business, query: string): boolean {
		if (!query) {
			return true;
		}

		return !!(
			business.name.toLowerCase().includes(query) ||
			business.techStack?.some((t) => t.toLowerCase().includes(query)) ||
			business.services?.some((s) => s.toLowerCase().includes(query))
		);
	}

	readonly typeCounts = computed<Record<string, number>>(() => {
		const query = this.searchQuery().toLowerCase().trim();

		const counts: Record<string, number> = { All: 0 };
		for (const type of this.types) {
			counts[type] = 0;
		}

		for (const business of this.businesses()) {
			if (!this.matchesQuery(business, query)) {
				continue;
			}

			counts['All'] += 1;
			if (Object.prototype.hasOwnProperty.call(counts, business.type)) {
				counts[business.type] += 1;
			}
		}

		return counts;
	});

	readonly filteredBusinesses = computed<Business[]>(() => {
		const type = this.activeType();
		const query = this.searchQuery().toLowerCase().trim();
		const sort = this.sortBy();

		let result = this.businesses();

		if (type !== 'All') {
			result = result.filter((b) => b.type === type);
		}

		if (query) {
			result = result.filter((b) => this.matchesQuery(b, query));
		}

		return [...result].sort((a, b) => {
			if (sort === 'name') return a.name.localeCompare(b.name, 'uk');
			if (sort === 'founded') return (a.founded ?? 0) - (b.founded ?? 0);
			if (sort === 'employees') return (b.employees ?? 0) - (a.employees ?? 0);
			return 0;
		});
	});
}
