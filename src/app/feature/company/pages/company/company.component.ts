import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { Company } from '../../company.interface';
import { CompanyService } from '../../company.service';
import { Review } from '../../review.interface';
import { ReviewsService } from '../../../review/api/reviews.service';
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';

interface ApiReviewItem {
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

interface CompanyReviewItem {
	id: string;
	companyId: string;
	author: string;
	rating: Review['rating'];
	text: string;
	date: string;
	status: Review['status'];
}

@Component({
	selector: 'app-company',
	imports: [BreadcrumbComponent, FormsModule, SlicePipe],
	templateUrl: './company.component.html',
	styleUrl: './company.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyComponent {
	private readonly _companyService = inject(CompanyService);
	private readonly _route = inject(ActivatedRoute);
	private readonly _reviewsService = inject(ReviewsService);
	private readonly _reviews = signal<CompanyReviewItem[]>([]);

	protected readonly reviewForm = signal({
		author: '',
		rating: 5 as Review['rating'],
		text: '',
	});
	protected readonly reviewFormMessage = signal('');
	protected readonly reviewFormError = signal('');
	protected readonly isSubmittingReview = signal(false);

	private readonly _routeId = toSignal(this._route.params.pipe(map((p) => p['id'] as string)), {
		initialValue: '',
	});

	protected readonly company = toSignal<Company | null>(
		toObservable(this._routeId).pipe(
			filter((id) => !!id),
			switchMap((id) => this._companyService.fetchById(id)),
		),
		{ initialValue: null },
	);

	protected readonly reviews = computed(() => {
		const company = this.company();
		if (!company) {
			return [];
		}

		return this._reviews()
			.filter((review) => review.companyId === company.id && review.status === 'published')
			.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
	});

	protected readonly breadcrumbs = computed<Crumb[]>(() => {
		const company = this.company();

		return [
			{ label: 'РљРѕРјРїР°РЅС–С—', link: '/companies' },
			{ label: company ? company.name : 'вЂ¦' },
		];
	});

	protected readonly ratingRange = [1, 2, 3, 4, 5];

	constructor() {
		effect(() => {
			const company = this.company();

			if (!company?.id) {
				this._reviews.set([]);
				return;
			}

			void this._refreshReviews();
		});
	}

	protected async submitReview() {
		const company = this.company();
		const value = this.reviewForm();

		if (!company || !value.author.trim() || !value.text.trim()) {
			return;
		}

		this.isSubmittingReview.set(true);
		this.reviewFormError.set('');
		this.reviewFormMessage.set('');

		try {
			const response = await this._reviewsService.createReview<
				unknown,
				{ data: Omit<CompanyReviewItem, 'id'> }
			>({
				data: {
					companyId: company.id,
					author: value.author.trim(),
					rating: value.rating,
					text: value.text.trim(),
					date: new Date().toISOString(),
					status: 'pending',
				},
			});

			if (response === null) {
				throw new Error('Failed to create review.');
			}

			await this._refreshReviews();
			this.reviewForm.set({
				author: '',
				rating: 5,
				text: '',
			});
			this.reviewFormMessage.set('Review submitted. It will appear after moderation.');
		} catch (error) {
			console.error(error);
			this.reviewFormError.set('Failed to submit review. Please try again.');
		} finally {
			this.isSubmittingReview.set(false);
		}
	}

	protected updateDraftRating(rating: number) {
		if (rating < 1 || rating > 5) {
			return;
		}

		this.reviewForm.set({
			...this.reviewForm(),
			rating: rating as Review['rating'],
		});
	}

	private async _refreshReviews() {
		const reviews = await this._reviewsService.getReviews<ApiReviewItem[]>();

		this._reviews.set(Array.isArray(reviews) ? reviews.map((review) => this._mapReview(review)) : []);
	}

	private _mapReview(review: ApiReviewItem): CompanyReviewItem {
		const data = review.data || {};

		return {
			id: String(review._id || review.id || ''),
			companyId: data.companyId || '',
			author: data.author || 'Unknown author',
			rating: this._normalizeRating(data.rating),
			text: data.text || '',
			date: data.date || new Date().toISOString(),
			status: this._normalizeStatus(data.status),
		};
	}

	private _normalizeRating(value: number | string | undefined): Review['rating'] {
		const normalized = Math.min(5, Math.max(1, Number(value) || 5));

		return normalized as Review['rating'];
	}

	private _normalizeStatus(status: string | undefined): Review['status'] {
		if (status === 'published' || status === 'pending' || status === 'rejected') {
			return status;
		}

		if (status === 'approved') {
			return 'published';
		}

		return 'pending';
	}
}
