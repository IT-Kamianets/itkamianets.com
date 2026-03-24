import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BusinessService } from '../../../business/business.service';
import { Review, ReviewStatus } from '../../../business/review.interface';
import { ReviewService } from '../../../business/review.service';

interface ReviewFormValue {
	businessId: string;
	author: string;
	rating: 1 | 2 | 3 | 4 | 5;
	text: string;
	date: string;
	status: ReviewStatus;
}

@Component({
	selector: 'app-manage-reviews',
	imports: [FormsModule, RouterLink, DatePipe],
	templateUrl: './manage-reviews.component.html',
	styleUrl: './manage-reviews.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageReviewsComponent {
	private readonly _reviewService = inject(ReviewService);
	private readonly _businessService = inject(BusinessService);

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly statusOptions: ReviewStatus[] = ['pending', 'approved', 'rejected'];
	protected readonly reviews = computed(() =>
		[...this._reviewService.reviews()].sort(
			(left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
		),
	);
	protected readonly businesses = computed(() => this._businessService.businesses());
	protected readonly reviewCounts = computed(() => {
		const reviews = this.reviews();

		return {
			all: reviews.length,
			approved: reviews.filter((review) => review.status === 'approved').length,
			pending: reviews.filter((review) => review.status === 'pending').length,
			rejected: reviews.filter((review) => review.status === 'rejected').length,
		};
	});

	protected readonly editingReviewId = signal<number | null>(null);
	protected readonly form = signal<ReviewFormValue>(this._createEmptyForm());

	protected startCreate() {
		this.editingReviewId.set(null);
		this.form.set(this._createEmptyForm());
	}

	protected startEdit(review: Review) {
		this.editingReviewId.set(review.id);
		this.form.set({
			businessId: review.businessId,
			author: review.author,
			rating: review.rating,
			text: review.text,
			date: review.date.slice(0, 10),
			status: review.status,
		});
	}

	protected save() {
		const value = this.form();
		const payload: Omit<Review, 'id'> = {
			businessId: value.businessId,
			author: value.author.trim(),
			rating: value.rating,
			text: value.text.trim(),
			date: new Date(value.date).toISOString(),
			status: value.status,
		};

		if (!payload.businessId || !payload.author || !payload.text || !value.date) {
			return;
		}

		const reviewId = this.editingReviewId();

		if (reviewId) {
			this._reviewService.update(reviewId, payload);
		} else {
			this._reviewService.create(payload);
		}

		this.startCreate();
	}

	protected approve(review: Review) {
		this._reviewService.setStatus(review.id, 'approved');
	}

	protected reject(review: Review) {
		this._reviewService.setStatus(review.id, 'rejected');
	}

	protected markPending(review: Review) {
		this._reviewService.setStatus(review.id, 'pending');
	}

	protected remove(review: Review) {
		this._reviewService.delete(review.id);

		if (this.editingReviewId() === review.id) {
			this.startCreate();
		}
	}

	protected cancelEdit() {
		this.startCreate();
	}

	protected getBusinessName(businessId: string) {
		return this.businesses().find((business) => business.id === businessId)?.name || 'Компанія';
	}

	protected getStatusLabel(status: ReviewStatus) {
		if (status === 'approved') {
			return 'Approved';
		}

		if (status === 'rejected') {
			return 'Rejected';
		}

		return 'Pending';
	}

	protected updateRating(value: string | number) {
		const nextRating = Number(value);
		if (nextRating >= 1 && nextRating <= 5) {
			this.form.set({
				...this.form(),
				rating: nextRating as Review['rating'],
			});
		}
	}

	private _createEmptyForm(): ReviewFormValue {
		const firstBusiness = this.businesses()[0];

		return {
			businessId: firstBusiness?.id || '',
			author: '',
			rating: 5,
			text: '',
			date: new Date().toISOString().slice(0, 10),
			status: 'pending',
		};
	}
}
