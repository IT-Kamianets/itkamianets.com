import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { COMPANY_TYPES, Company } from '../../company.interface';
import { CompanyService } from '../../company.service';

@Component({
	selector: 'app-companies',
	imports: [RouterLink, FormsModule],
	templateUrl: './companies.component.html',
	styleUrl: './companies.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesComponent {
	private companyService = inject(CompanyService);
	readonly companies = this.companyService.companies;
	readonly types: string[] = COMPANY_TYPES;

	activeType = signal<string>('All');
	searchQuery = signal<string>('');
	sortBy = signal<'name' | 'founded' | 'employees'>('name');

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		title: Title,
		meta: Meta,
	) {
		title.setTitle("Компанії Кам'янця | IT-Kamianets");
		meta.updateTag({
			name: 'description',
			content: "Каталог IT-компаній Кам'янця-Подільського — студії, аутсорс, продуктові та агентства. Технології, послуги, контакти.",
		});
		meta.updateTag({ property: 'og:title', content: "Компанії Кам'янця | IT-Kamianets" });
		meta.updateTag({ property: 'og:description', content: "Каталог IT-компаній Кам'янця-Подільського — студії, аутсорс, продуктові та агентства." });
		meta.updateTag({ property: 'og:type', content: 'website' });

		const params = this.route.snapshot.queryParamMap;
		const type = params.get('type');
		const q = params.get('q');
		const sort = params.get('sort') as 'name' | 'founded' | 'employees' | null;

		if (type && [...COMPANY_TYPES, 'All'].includes(type)) this.activeType.set(type);
		if (q) this.searchQuery.set(q);
		if (sort && ['name', 'founded', 'employees'].includes(sort)) this.sortBy.set(sort);

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

	private _matchesQuery(company: Company, query: string): boolean {
		if (!query) {
			return true;
		}

		return !!(
			company.name.toLowerCase().includes(query) ||
			company.techStack?.some((t) => t.toLowerCase().includes(query)) ||
			company.services?.some((s) => s.toLowerCase().includes(query))
		);
	}

	readonly typeCounts = computed<Record<string, number>>(() => {
		const query = this.searchQuery().toLowerCase().trim();

		const counts: Record<string, number> = { All: 0 };
		for (const type of this.types) {
			counts[type] = 0;
		}

		for (const company of this.companies()) {
			if (!this._matchesQuery(company, query)) {
				continue;
			}

			counts['All'] += 1;
			if (Object.prototype.hasOwnProperty.call(counts, company.type)) {
				counts[company.type] += 1;
			}
		}

		return counts;
	});

	readonly filteredCompanies = computed<Company[]>(() => {
		const type = this.activeType();
		const query = this.searchQuery().toLowerCase().trim();
		const sort = this.sortBy();

		let result = this.companies();

		if (type !== 'All') {
			result = result.filter((c) => c.type === type);
		}

		if (query) {
			result = result.filter((c) => this._matchesQuery(c, query));
		}

		return [...result].sort((a, b) => {
			if (sort === 'name') return a.name.localeCompare(b.name, 'uk');
			if (sort === 'founded') return (a.founded ?? 0) - (b.founded ?? 0);
			if (sort === 'employees') return (b.employees ?? 0) - (a.employees ?? 0);
			return 0;
		});
	});
}
