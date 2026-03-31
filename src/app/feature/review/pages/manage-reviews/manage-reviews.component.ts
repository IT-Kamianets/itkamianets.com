import { DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	afterNextRender,
	computed,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../company/company.service';
import { Review } from '../../../company/review.interface';
import { ReviewService } from '../../../company/review.service';

interface ReviewFormValue {
	companyId: string;
	customCompanyName: string;
	author: string;
	rating: 1 | 2 | 3 | 4 | 5;
	text: string;
	date: string;
}

interface ReviewCompanyOption {
	id: string;
	name: string;
	type: string;
	label: string;
	reviewCount: number;
}

type ReviewFilter = 'all' | 'approved' | 'pending' | 'rejected';

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
	private readonly _formPanel = viewChild<ElementRef<HTMLFormElement>>('formPanel');
	private readonly _formScroll = viewChild<ElementRef<HTMLDivElement>>('formScroll');
	private readonly _authorInput = viewChild<ElementRef<HTMLInputElement>>('authorInput');
	private _formHighlightTimeout: ReturnType<typeof setTimeout> | null = null;

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly filterOptions: ReviewFilter[] = ['all', 'pending', 'approved', 'rejected'];
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
	protected readonly pendingQueueLabel = computed(() =>
		this.reviewCounts().pending
			? `${this.reviewCounts().pending} запис(и) очікують перевірки`
			: 'Черга модерації порожня',
	);

	protected readonly activeFilter = signal<ReviewFilter>('all');
	protected readonly searchQuery = signal('');
	protected readonly editingReviewId = signal<number | null>(null);
	protected readonly highlightForm = signal(false);
	protected readonly form = signal<ReviewFormValue>(this._createEmptyForm());

	protected startCreate() {
		this.editingReviewId.set(null);
		this.searchQuery.set('');
		this.activeFilter.set('all');
		this.form.set(this._createEmptyForm());
		this._scrollToForm();
	}

	protected startEdit(review: Review) {
		this.editingReviewId.set(review.id);
		this.form.set({
			companyId: review.companyId,
			customCompanyName: '',
			author: review.author,
			rating: review.rating,
			text: review.text,
			date: review.date.slice(0, 10),
		});
		this._scrollToForm();
	}

	protected save() {
		const value = this.form();
		const companyId =
			value.companyId || this._companyService.createLocalCompany(value.customCompanyName);

		if (!companyId || !value.author.trim() || !value.text.trim() || !value.date) {
			return;
		}

		const existingReview = this.editingReviewId()
			? this._reviewService.getById(this.editingReviewId()!)()
			: null;
		const payload: Omit<Review, 'id'> = {
			companyId,
			author: value.author.trim(),
			rating: value.rating,
			text: value.text.trim(),
			date: new Date(value.date).toISOString(),
			status: existingReview?.status || 'pending',
		};

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

	protected setFilter(status: ReviewFilter) {
		this.activeFilter.set(status);
	}

	protected getCompanyLabel(companyId: string) {
		return (
			this.companyOptions().find((company) => company.id === companyId)?.label ||
			'Компанія з каталогу'
		);
	}

	protected getStatusLabel(status: ReviewFilter) {
		if (status === 'approved') {
			return 'Підтверджено';
		}

		if (status === 'rejected') {
			return 'Відхилено';
		}

		if (status === 'pending') {
			return 'На перевірці';
		}

		return 'Усі';
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
		const firstCompany = this.companyOptions()[0];

		return {
			companyId: firstCompany?.id || '',
			customCompanyName: '',
			author: '',
			rating: 5 as Review['rating'],
			text: '',
			date: new Date().toISOString().slice(0, 10),
		};
	}

	private _scrollToForm() {
		if (typeof window === 'undefined') {
			return;
		}

		this.highlightForm.set(true);
		if (this._formHighlightTimeout) {
			clearTimeout(this._formHighlightTimeout);
		}
		this._formHighlightTimeout = setTimeout(() => this.highlightForm.set(false), 1200);

		afterNextRender(() => {
			this._formPanel()?.nativeElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});

			this._formScroll()?.nativeElement.scrollTo({
				top: 0,
				behavior: 'smooth',
			});

			this._authorInput()?.nativeElement.focus();
		});
	}
}
