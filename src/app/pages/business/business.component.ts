import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { Business } from '../../feature/business/business.interface';
import { BusinessService } from '../../feature/business/business.service';
import { ReviewService } from '../../feature/business/review.service';
import { BreadcrumbComponent, Crumb } from '../../shared/components/breadcrumb.component';

@Component({
	selector: 'app-business',
	imports: [BreadcrumbComponent, FormsModule, SlicePipe],
	templateUrl: './business.component.html',
	styleUrl: './business.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessComponent {
	private businessService = inject(BusinessService);
	private reviewService = inject(ReviewService);
	private route = inject(ActivatedRoute);

	private routeId = toSignal(this.route.params.pipe(map((p) => p['id'] as string)), { initialValue: '' });

	business = computed(() =>
		this.businessService.businesses().find((b) => b.id === this.routeId()) ?? null,
	);

	reviews = computed(() => {
		const b = this.business();
		if (!b) return [];
		return this.reviewService.getByBusinessId(b.id)();
	});

	reviewForm = { author: '', rating: 5, text: '' };

	breadcrumbs = computed<Crumb[]>(() => {
		const b = this.business();
		return [
			{ label: 'Бізнеси', link: '/businesses' },
			{ label: b ? b.name : '…' },
		];
	});

	constructor() {}

	submitReview(): void {
		const b = this.business();
		if (!b || !this.reviewForm.author.trim() || !this.reviewForm.text.trim()) return;

		this.reviewService.add({
			businessId: b.id,
			author: this.reviewForm.author.trim(),
			rating: this.reviewForm.rating as 1 | 2 | 3 | 4 | 5,
			text: this.reviewForm.text.trim(),
			date: new Date().toISOString(),
		});

		this.reviewForm = { author: '', rating: 5, text: '' };
	}

	ratingRange = [1, 2, 3, 4, 5];

	private getOgImageUrl(logoUrl: string): string {
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
			return logoUrl;
		}
	}
}
