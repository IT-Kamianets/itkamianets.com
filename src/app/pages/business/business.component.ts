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
				this.meta.updateTag({ property: 'og:image', content: this.getOgImageUrl(found.logo) });
				this.meta.updateTag({ property: 'og:type', content: 'website' });
			} else {
				this.router.navigate(['/businesses'], { replaceUrl: true });
			}
		});
	}

	private getOgImageUrl(logoUrl: string): string {
		// Transform known thumbnail parameters (e.g., w=200&h=200) to a more suitable OG size.
		try {
			const url = new URL(logoUrl, window.location.origin);
			const params = url.searchParams;

			if (params.has('w')) {
				params.set('w', '1200');
			}
			if (params.has('h')) {
				params.set('h', '630');
			}

			return url.toString();
		} catch {
			// If parsing fails or the URL is relative/invalid, fall back to the original logo URL.
			return logoUrl;
		}
	}
}
