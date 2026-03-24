import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BusinessService } from '../../../business/business.service';
import { ReviewService } from '../../../business/review.service';
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';

@Component({
	selector: 'app-reviews',
	imports: [BreadcrumbComponent, DatePipe, DecimalPipe, RouterLink],
	templateUrl: './reviews.component.html',
	styleUrl: './reviews.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsComponent {
	private readonly _reviewService = inject(ReviewService);
	private readonly _businessService = inject(BusinessService);

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly breadcrumbs: Crumb[] = [
		{ label: 'Головна', link: '/' },
		{ label: 'Відгуки' },
	];

	protected readonly reviews = computed(() =>
		[...this._reviewService.publishedReviews()].sort(
			(left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
		),
	);

	protected readonly averageRating = computed(() => {
		const reviews = this.reviews();
		if (!reviews.length) {
			return 0;
		}

		const total = reviews.reduce((sum, review) => sum + review.rating, 0);
		return total / reviews.length;
	});

	protected getBusinessName(businessId: string) {
		return (
			this._businessService.businesses().find((business) => business.id === businessId)?.name ||
			'Компанія'
		);
	}
}
