import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BUSINESSES, Business } from '../../data/businesses.data';
import { BreadcrumbComponent, Crumb } from '../../shared/components/breadcrumb.component';

@Component({
	selector: 'app-business',
	imports: [BreadcrumbComponent],
	templateUrl: './business.component.html',
	styleUrl: './business.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessComponent {
	business = signal<Business | null>(null);

	breadcrumbs = computed<Crumb[]>(() => {
		const b = this.business();
		return [
			{ label: 'Бізнеси', link: '/businesses' },
			{ label: b ? b.name : '…' },
		];
	});

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private title: Title,
		private meta: Meta,
	) {
		this.route.params.subscribe((params) => {
			const found = BUSINESSES.find((b) => b.id === params['id']) ?? null;
			this.business.set(found);

			if (found) {
				this.title.setTitle(found.name + ' | IT-Kamianets');
				this.meta.updateTag({ name: 'description', content: found.shortDescription });
				this.meta.updateTag({ property: 'og:title', content: found.name + ' | IT-Kamianets' });
				this.meta.updateTag({ property: 'og:description', content: found.shortDescription });
				this.meta.updateTag({ property: 'og:image', content: found.logo });
				this.meta.updateTag({ property: 'og:type', content: 'website' });
			} else {
				this.router.navigate(['/businesses'], { replaceUrl: true });
			}
		});
	}
}
