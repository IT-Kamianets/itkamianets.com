import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { Company } from '../../company.interface';
import { CompanyService } from '../../company.service';
import { ReviewService } from '../../review.service';
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';

@Component({
	selector: 'app-company',
	imports: [BreadcrumbComponent, FormsModule, SlicePipe],
	templateUrl: './company.component.html',
	styleUrl: './company.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyComponent {
	private companyService = inject(CompanyService);
	private reviewService = inject(ReviewService);
	private route = inject(ActivatedRoute);

	private routeId = toSignal(this.route.params.pipe(map((p) => p['id'] as string)), { initialValue: '' });

	company = toSignal<Company | null>(
		toObservable(this.routeId).pipe(
			filter((id) => !!id),
			switchMap((id) => this.companyService.fetchById(id)),
		),
		{ initialValue: null },
	);

	reviews = computed(() => {
		const c = this.company();
		if (!c) return [];
		return this.reviewService.getByCompanyId(c.id)();
	});

	reviewForm = { author: '', rating: 5, text: '' };

	breadcrumbs = computed<Crumb[]>(() => {
		const c = this.company();
		return [
			{ label: 'Компанії', link: '/companies' },
			{ label: c ? c.name : '…' },
		];
	});

	constructor() {}

	submitReview(): void {
		const c = this.company();
		if (!c || !this.reviewForm.author.trim() || !this.reviewForm.text.trim()) return;

		this.reviewService.add({
			companyId: c.id,
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
