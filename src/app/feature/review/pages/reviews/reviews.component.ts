import { DatePipe, DecimalPipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	computed,
	inject,
	signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../company/company.service';
import { getReviews } from '../../api/reviewApi';
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';

interface ReviewListItem {
	id: string;
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

interface ApiReviewItem {
	_id?: string;
	id?: number | string;
	data?: {
		status?: string;
		author?: string;
		companyId?: string;
		rating?: number | string;
		date?: string;
		text?: string;
	};
	status?: string;
	author?: string;
	companyId?: string;
	rating?: number | string;
	date?: string;
	text?: string;
}

@Component({
	selector: 'app-reviews',
	imports: [BreadcrumbComponent, DatePipe, DecimalPipe, RouterLink],
	templateUrl: './reviews.component.html',
	styleUrl: './reviews.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsComponent implements OnInit {
	private readonly _companyService = inject(CompanyService);
	private readonly _reviews = signal<ApiReviewItem[]>([]);

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly breadcrumbs: Crumb[] = [
		{ label: 'Головна', link: '/' },
		{ label: 'Відгуки' },
	];

	protected readonly reviewItems = computed<ReviewListItem[]>(() => {
		const companies = this._companyService.companies();

		return [...this._reviews()]
			.filter((review) => review.data?.status === 'published')
			.sort((left, right) => {
				const leftDate = left.data?.date || left.date || '';
				const rightDate = right.data?.date || right.date || '';

				return new Date(rightDate).getTime() - new Date(leftDate).getTime();
			})
			.map((review) => {
				const companyId = review.data?.companyId || review.companyId || '';
				const company = companies.find((item) => item.id === companyId) || null;
				const author = review.data?.author || review.author || 'Невідомий автор';
				const text = review.data?.text || review.text || '';
				const date = review.data?.date || review.date || new Date().toISOString();
				const rating = this._normalizeRating(review.data?.rating || review.rating);

				return {
					id: String(review._id || review.id || ''),
					author,
					companyId,
					companyName: company?.name || 'Компанія з каталогу',
					companyType: company?.type || 'Компанія',
					companyDescription:
						company?.shortDescription ||
						'Команда з каталогу IT-Kamianets, для якої вже є публічні клієнтські відгуки.',
					rating,
					date,
					text,
					excerpt: this._createExcerpt(text),
					isVerifiedCompany: !!company?.verified,
				};
			})
			.filter((review) => Boolean(review.id));
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

	async ngOnInit() {
		const reviews = await getReviews<ApiReviewItem[]>();

		this._reviews.set(Array.isArray(reviews) ? reviews : []);
	}

	protected trackReview(_index: number, review: ReviewListItem) {
		return review.id;
	}

	private _createExcerpt(text: string) {
		if (text.length <= 180) {
			return text;
		}

		return `${text.slice(0, 177).trimEnd()}...`;
	}

	private _normalizeRating(value: number | string | undefined): 1 | 2 | 3 | 4 | 5 {
		const normalized = Math.min(5, Math.max(1, Number(value) || 5));

		return normalized as 1 | 2 | 3 | 4 | 5;
	}
}
