import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../company/company.service';
import { Review, ReviewStatus } from '../../../company/review.interface';
import { ReviewService } from '../../../company/review.service';

interface ReviewFormValue {
	companyId: string;
	author: string;
	rating: 1 | 2 | 3 | 4 | 5;
	text: string;
	date: string;
	status: ReviewStatus;
}

interface ReviewCompanyOption {
	id: string;
	name: string;
	type: string;
	label: string;
	reviewCount: number;
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
	private readonly _companyService = inject(CompanyService);

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly statusOptions: ReviewStatus[] = ['pending', 'approved', 'rejected'];
	protected readonly filterOptions: Array<ReviewStatus | 'all'> = [
		'all',
		'pending',
		'approved',
		'rejected',
	];
	protected readonly companies = computed(() => this._companyService.companies());
	protected readonly companyOptions = computed<ReviewCompanyOption[]>(() =>
		this.companies()
			.map((company) => {
				const reviewCount = this._reviewService
					.reviews()
					.filter((review) => review.companyId === company.id).length;

				return {
					id: company.id,
					name: company.name,
					type: company.type,
					label: `${company.name} - ${company.type}`,
					reviewCount,
				};
			})
			.sort((left, right) => left.name.localeCompare(right.name, 'uk')),
	);
	protected readonly reviewCounts = computed(() => {
		const reviews = this._reviewService.reviews();

		return {
			all: reviews.length,
			approved: reviews.filter((review) => review.status === 'approved').length,
			pending: reviews.filter((review) => review.status === 'pending').length,
			rejected: reviews.filter((review) => review.status === 'rejected').length,
		};
	});
	protected readonly filteredReviews = computed(() => {
		const query = this.searchQuery().trim().toLowerCase();
		const status = this.activeFilter();

		return [...this._reviewService.reviews()]
			.filter((review) => {
				if (status !== 'all' && review.status !== status) {
					return false;
				}

				if (!query) {
					return true;
				}

				const companyLabel = this.getCompanyLabel(review.companyId).toLowerCase();

				return (
					review.author.toLowerCase().includes(query) ||
					review.text.toLowerCase().includes(query) ||
					companyLabel.includes(query)
				);
			})
			.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
	});
	protected readonly selectedCompany = computed(
		() =>
			this.companyOptions().find((company) => company.id === this.form().companyId) || null,
	);
	protected readonly pendingQueueLabel = computed(
		() =>
			this.reviewCounts().pending
				? `${this.reviewCounts().pending} запис(и) очікують перевірки`
				: 'Черга модерації порожня',
	);

	protected readonly activeFilter = signal<ReviewStatus | 'all'>('all');
	protected readonly searchQuery = signal('');
	protected readonly editingReviewId = signal<number | null>(null);
	protected readonly form = signal<ReviewFormValue>(this._createEmptyForm());

	protected startCreate() {
		this.editingReviewId.set(null);
		this.form.set(this._createEmptyForm());
	}

	protected startEdit(review: Review) {
		this.editingReviewId.set(review.id);
		this.form.set({
			companyId: review.companyId,
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
			companyId: value.companyId,
			author: value.author.trim(),
			rating: value.rating,
			text: value.text.trim(),
			date: new Date(value.date).toISOString(),
			status: value.status,
		};

		if (!payload.companyId || !payload.author || !payload.text || !value.date) {
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

	protected setFilter(status: ReviewStatus | 'all') {
		this.activeFilter.set(status);
	}

	protected getCompanyName(companyId: string) {
		return (
			this.companyOptions().find((company) => company.id === companyId)?.name ||
			'Компанія з каталогу'
		);
	}

	protected getCompanyLabel(companyId: string) {
		return (
			this.companyOptions().find((company) => company.id === companyId)?.label ||
			'Компанія з каталогу'
		);
	}

	protected getStatusLabel(status: ReviewStatus | 'all') {
		if (status === 'approved') {
			return 'Approved';
		}

		if (status === 'rejected') {
			return 'Rejected';
		}

		if (status === 'pending') {
			return 'Pending';
		}

		return 'All';
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

	private _createEmptyForm() {
		const firstCompany = this.companyOptions()[0];

		return {
			companyId: firstCompany?.id || '',
			author: '',
			rating: 5 as Review['rating'],
			text: '',
			date: new Date().toISOString().slice(0, 10),
			status: 'pending' as ReviewStatus,
		};
	}
}
