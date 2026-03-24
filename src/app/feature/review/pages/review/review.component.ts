import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BusinessService } from '../../../business/business.service';
import { ReviewService } from '../../../business/review.service';
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';

@Component({
	selector: 'app-review',
	imports: [BreadcrumbComponent, DatePipe, RouterLink],
	templateUrl: './review.component.html',
	styleUrl: './review.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
	private readonly _route = inject(ActivatedRoute);
	private readonly _reviewService = inject(ReviewService);
	private readonly _businessService = inject(BusinessService);

	private readonly _reviewId = toSignal(
		this._route.paramMap.pipe(map((params) => Number(params.get('id')) || 0)),
		{ initialValue: 0 },
	);

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly review = computed(() => this._reviewService.getById(this._reviewId())());
	protected readonly business = computed(() => {
		const review = this.review();
		if (!review) {
			return null;
		}

		return (
			this._businessService.businesses().find((business) => business.id === review.businessId) ||
			null
		);
	});

	protected readonly breadcrumbs = computed<Crumb[]>(() => {
		const review = this.review();

		return [
			{ label: 'Головна', link: '/' },
			{ label: 'Відгуки', link: '/reviews' },
			{ label: review ? `Відгук #${review.id}` : 'Відгук' },
		];
	});
}
