import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../company/company.service';
import { ReviewService } from '../../../company/review.service';
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';

interface ReviewListItem {
	id: number;
	author: string;
	companyId: string;
	companyName: string;
	companyType: string;
	companyDescription: string;
	rating: 1 | 2 | 3 | 4 | 5;
	date: string;
	text: string;
	excerpt: string;
	isVerifiedCompany: boolean;
}

@Component({
	selector: 'app-reviews',
	imports: [BreadcrumbComponent, DatePipe, DecimalPipe, RouterLink],
	templateUrl: './reviews.component.html',
	styleUrl: './reviews.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsComponent {
	private readonly _reviewService = inject(ReviewService);
	private readonly _companyService = inject(CompanyService);

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly breadcrumbs: Crumb[] = [
		{ label: 'Головна', link: '/' },
		{ label: 'Відгуки' },
	];

	protected readonly reviewItems = computed<ReviewListItem[]>(() => {
		const companies = this._companyService.companies();

		return [...this._reviewService.publishedReviews()]
			.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
			.map((review) => {
				const company = companies.find((item) => item.id === review.companyId) || null;

				return {
					id: review.id,
					author: review.author,
					companyId: review.companyId,
					companyName: company?.name || 'Компанія з каталогу',
					companyType: company?.type || 'Компанія',
					companyDescription:
						company?.shortDescription ||
						'Команда з каталогу IT-Kamianets, для якої вже є публічні клієнтські відгуки.',
					rating: review.rating,
					date: review.date,
					text: review.text,
					excerpt: this._createExcerpt(review.text),
					isVerifiedCompany: !!company?.verified,
				};
			});
	});

	protected readonly averageRating = computed(() => {
		const reviews = this.reviewItems();
		if (!reviews.length) {
			return 0;
		}

		const total = reviews.reduce((sum, review) => sum + review.rating, 0);
		return total / reviews.length;
	});

	protected readonly companiesCount = computed(
		() => new Set(this.reviewItems().map((review) => review.companyId)).size,
	);

	protected readonly topRatedCount = computed(
		() => this.reviewItems().filter((review) => review.rating === 5).length,
	);

	protected trackReview(_index: number, review: ReviewListItem) {
		return review.id;
	}

	private _createExcerpt(text: string) {
		if (text.length <= 180) {
			return text;
		}

		return `${text.slice(0, 177).trimEnd()}...`;
	}
}
