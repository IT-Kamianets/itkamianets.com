import { DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CompanyService } from '../../../company/company.service';
import { ReviewService } from '../../../company/review.service';
import { getReviewById } from '../../api/reviewApi';
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';

interface ApiReviewData {
	_id?: string;
	id?: number | string;
	data?: {
		author?: string;
		companyId?: string;
		rating?: number | string;
		text?: string;
		date?: string;
		status?: string;
	};
}

interface ReviewDetail {
	id: string;
	author: string;
	companyId: string;
	rating: 1 | 2 | 3 | 4 | 5;
	text: string;
	date: string;
	status: string;
}

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
	private readonly _companyService = inject(CompanyService);
	private readonly _reviewResponse = signal<ApiReviewData | null>(null);

	private readonly _reviewId = toSignal(
		this._route.paramMap.pipe(map((params) => params.get('id') || '')),
		{ initialValue: '' },
	);
	private readonly _localReviewId = computed(() => {
		const normalized = Number(this._reviewId());

		return Number.isFinite(normalized) && normalized > 0 ? normalized : 0;
	});
	private readonly _localReview = computed(() =>
		this._localReviewId() ? this._reviewService.getPublishedById(this._localReviewId())() : null,
	);

	constructor() {
		effect(() => {
			const reviewId = this._reviewId();

			if (!reviewId) {
				this._reviewResponse.set(null);
				return;
			}

			if (this._localReview()) {
				this._reviewResponse.set(null);
				return;
			}

			void this._loadReview(reviewId);
		});
	}

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly review = computed<ReviewDetail | null>(() => {
		const localReview = this._localReview();
		if (localReview) {
			return {
				id: String(localReview.id),
				author: localReview.author,
				companyId: localReview.companyId,
				rating: localReview.rating,
				text: localReview.text,
				date: localReview.date,
				status: localReview.status,
			};
		}

		const response = this._reviewResponse();
		const data = response?.data;

		if (!data) {
			return null;
		}

		return {
			id: String(response._id || response.id || ''),
			author: data.author || 'Невідомий автор',
			companyId: data.companyId || '',
			rating: this._normalizeRating(data.rating),
			text: data.text || '',
			date: data.date || new Date().toISOString(),
			status: data.status || '',
		};
	});
	protected readonly company = computed(() => {
		const review = this.review();
		if (!review) {
			return null;
		}

		return (
			this._companyService.companies().find((company) => company.id === review.companyId) ||
			null
		);
	});
	protected readonly relatedReviews = computed(() => {
		const review = this.review();
		if (!review) {
			return [];
		}

		return this._reviewService
			.publishedReviews()
			.filter((item) => item.companyId === review.companyId && String(item.id) !== review.id)
			.slice(0, 3);
	});
	protected readonly reviewSummary = computed(() => {
		const review = this.review();
		const company = this.company();

		return {
			companyName: company?.name || 'Компанія з каталогу',
			companyType: company?.type || 'Компанія',
			companyDescription:
				company?.shortDescription ||
				'Команда з каталогу IT-Kamianets, для якої вже доступний публічний відгук.',
			services: company?.services.slice(0, 4) || [],
			techStack: company?.techStack.slice(0, 5) || [],
			contactWebsite: company?.contacts.website || null,
			employees: company?.employees || null,
			founded: company?.founded || null,
			verified: !!company?.verified,
			totalCompanyReviews: review
				? this._reviewService
						.publishedReviews()
						.filter((item) => item.companyId === review.companyId).length
				: 0,
		};
	});

	protected readonly breadcrumbs = computed<Crumb[]>(() => {
		const review = this.review();

		return [
			{ label: 'Головна', link: '/' },
			{ label: 'Відгуки', link: '/reviews' },
			{ label: review ? `Відгук #${review.id}` : 'Відгук' },
		];
	});

	private async _loadReview(id: string) {
		const response = await getReviewById<ApiReviewData>(id);

		this._reviewResponse.set(response);
	}

	private _normalizeRating(value: number | string | undefined): 1 | 2 | 3 | 4 | 5 {
		const normalized = Math.min(5, Math.max(1, Number(value) || 5));

		return normalized as 1 | 2 | 3 | 4 | 5;
	}
}
