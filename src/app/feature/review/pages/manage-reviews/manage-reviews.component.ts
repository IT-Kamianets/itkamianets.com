import { DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnInit,
	afterNextRender,
	computed,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Company } from '../../../company/company.interface';
import { CompanyService } from '../../../company/company.service';
import { Review } from '../../../company/review.interface';
import { ReviewsService } from '../../api/reviews.service';

interface ReviewFormValue {
	companyId: string;
	author: string;
	rating: 1 | 2 | 3 | 4 | 5;
	text: string;
	date: string;
	status: Review['status'];
}

interface ReviewCompanyOption {
	id: string;
	name: string;
	type: string;
	label: string;
	reviewCount: number;
}

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

interface ManageReviewItem {
	id: string;
	apiId: string;
	companyId: string;
	author: string;
	rating: Review['rating'];
	text: string;
	date: string;
	status: Review['status'];
}

type ReviewFilter = 'all' | Review['status'];

@Component({
	selector: 'app-manage-reviews',
	imports: [FormsModule, RouterLink, DatePipe],
	templateUrl: './manage-reviews.component.html',
	styleUrl: './manage-reviews.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageReviewsComponent implements OnInit {
	private readonly _companyService = inject(CompanyService);
	private readonly _reviewsService = inject(ReviewsService);
	private readonly _formPanel = viewChild<ElementRef<HTMLFormElement>>('formPanel');
	private readonly _authorInput = viewChild<ElementRef<HTMLInputElement>>('authorInput');
	private readonly _reviews = signal<ManageReviewItem[]>([]);
	private _formHighlightTimeout: ReturnType<typeof setTimeout> | null = null;

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly filterOptions: ReviewFilter[] = ['all', 'pending', 'published', 'rejected'];
	protected readonly companies = computed(() => this._companyService.companies());
	protected readonly companyOptions = computed<ReviewCompanyOption[]>(() =>
		this.companies()
			.map((company) => {
				const reviewCount = this._reviews().filter((review) => review.companyId === company.id).length;

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
		const reviews = this._reviews();

		return {
			all: reviews.length,
			published: reviews.filter((review) => review.status === 'published').length,
			pending: reviews.filter((review) => review.status === 'pending').length,
			rejected: reviews.filter((review) => review.status === 'rejected').length,
		};
	});
	protected readonly filteredReviews = computed(() => {
		const query = this.searchQuery().trim().toLowerCase();
		const status = this.activeFilter();

		return [...this._reviews()]
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
	protected readonly editingReviewId = signal<string | null>(null);
	protected readonly highlightForm = signal(false);
	protected readonly isFormVisible = signal(false);
	protected readonly form = signal<ReviewFormValue>(this._createEmptyForm());
	protected readonly isListLoading = signal(false);
	protected readonly isSubmitting = signal(false);
	protected readonly processingReviewId = signal<string | null>(null);
	protected readonly feedbackMessage = signal('');
	protected readonly feedbackTone = signal<'success' | 'error'>('success');

	async ngOnInit() {
		await this._refreshReviews();
	}

	protected startCreate() {
		this._clearFeedback();
		this.isFormVisible.set(true);
		this.editingReviewId.set(null);
		this.form.set(this._createEmptyForm());
		this._scrollToForm();
	}

	protected startEdit(review: ManageReviewItem) {
		this._clearFeedback();
		this.isFormVisible.set(true);
		this.editingReviewId.set(review.id);
		this.form.set({
			companyId: review.companyId,
			author: review.author,
			rating: review.rating,
			text: review.text,
			date: review.date.slice(0, 10),
			status: review.status,
		});
		this._scrollToForm();
	}

	protected async save() {
		const value = this.form();
		const companyId = value.companyId.trim();
		this._clearFeedback();

		if (!companyId || !value.author.trim() || !value.text.trim() || !value.date) {
			this._setFeedback('Помилка', 'error');
			return;
		}

		this.isSubmitting.set(true);

		const existingReview = this._getCurrentEditingReview();
		const payload = {
			data: {
				author: value.author.trim(),
				companyId,
				rating: value.rating,
				text: value.text.trim(),
				date: new Date(value.date).toISOString(),
				status: value.status || existingReview?.status || 'pending',
			},
		};

		if (existingReview?.apiId) {
			const response = await this._reviewsService.updateReview(existingReview.apiId, payload);
			if (response === null) {
				this._setFeedback('Помилка', 'error');
				this.isSubmitting.set(false);
				return;
			}

			this._setFeedback('Оновлено', 'success');
		} else {
			const response = await this._reviewsService.createReview(payload);
			if (response === null) {
				this._setFeedback('Помилка', 'error');
				this.isSubmitting.set(false);
				return;
			}

			this._setFeedback('Успішно створено', 'success');
		}

		await this._refreshReviews();
		this.isSubmitting.set(false);
		this.closeForm();
	}

	protected async setStatus(review: ManageReviewItem, status: Review['status']) {
		await this._updateStatus(review.id, status);
	}

	protected async remove(review: ManageReviewItem) {
		const currentReview = this._findReview(review.id);
		this._clearFeedback();

		if (!currentReview?.apiId) {
			return;
		}

		if (typeof window !== 'undefined' && !window.confirm('Підтвердити видалення?')) {
			return;
		}

		this.processingReviewId.set(review.id);

		const response = await this._reviewsService.deleteReview(currentReview.apiId);
		if (response === null) {
			this._setFeedback('Помилка', 'error');
			this.processingReviewId.set(null);
			return;
		}

		await this._refreshReviews();
		this.processingReviewId.set(null);
		this._setFeedback('Видалено', 'success');

		if (this.editingReviewId() === review.id) {
			this.closeForm();
		}
	}

	protected cancelEdit() {
		this.closeForm();
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

	protected getCompanyName(companyId: string) {
		return this._getCompany(companyId)?.name || 'Компанію не знайдено';
	}

	protected getCompanyType(companyId: string) {
		return this._getCompany(companyId)?.type || 'Без типу';
	}

	protected getCompanyLogo(companyId: string) {
		return this._getCompany(companyId)?.logo || '';
	}

	protected getStatusLabel(status: ReviewFilter) {
		if (status === 'published') {
			return 'Опубліковано';
		}

		if (status === 'rejected') {
			return 'Відхилено';
		}

		if (status === 'pending') {
			return 'На перевірці';
		}

		return 'Усі';
	}

	protected getReviewExcerpt(text: string) {
		const normalizedText = text.replace(/\s+/g, ' ').trim();
		if (normalizedText.length <= 120) {
			return normalizedText;
		}

		return `${normalizedText.slice(0, 117)}...`;
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

	protected closeForm() {
		this.isFormVisible.set(false);
		this.editingReviewId.set(null);
		this.form.set(this._createEmptyForm());
		this.isSubmitting.set(false);
	}

	protected isReviewBusy(reviewId: string) {
		return this.processingReviewId() === reviewId;
	}

	private _createEmptyForm(): ReviewFormValue {
		return {
			companyId: '',
			author: '',
			rating: 5 as Review['rating'],
			text: '',
			date: new Date().toISOString().slice(0, 10),
			status: 'pending',
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

			this._authorInput()?.nativeElement.focus();
		});
	}

	private _getCompany(companyId: string): Company | null {
		return this.companies().find((company) => company.id === companyId) || null;
	}

	private async _refreshReviews() {
		this.isListLoading.set(true);
		const reviews = await this._reviewsService.getReviews<ApiReviewItem[]>();

		if (reviews === null) {
			this._setFeedback('Помилка', 'error');
			this.isListLoading.set(false);
			return;
		}

		this._reviews.set(Array.isArray(reviews) ? reviews.map((review) => this._mapReview(review)) : []);
		this.isListLoading.set(false);
	}

	private _mapReview(review: ApiReviewItem): ManageReviewItem {
		const data = review.data || {};
		const routeId = String(review._id || review.id || '');

		return {
			apiId: String(review._id || ''),
			id: routeId,
			companyId: data.companyId || '',
			author: data.author || 'Невідомий автор',
			rating: this._normalizeRating(data.rating),
			text: data.text || '',
			date: data.date || new Date().toISOString(),
			status: this._normalizeStatus(data.status),
		};
	}

	private _normalizeRating(value: number | string | undefined): 1 | 2 | 3 | 4 | 5 {
		const normalized = Math.min(5, Math.max(1, Number(value) || 5));

		return normalized as 1 | 2 | 3 | 4 | 5;
	}

	private _normalizeStatus(status: string | undefined): Review['status'] {
		if (status === 'published' || status === 'rejected' || status === 'pending') {
			return status;
		}

		if (status === 'approved') {
			return 'published';
		}

		return 'pending';
	}

	private _findReview(id: string) {
		return this._reviews().find((review) => review.id === id) || null;
	}

	private _getCurrentEditingReview() {
		const reviewId = this.editingReviewId();

		return reviewId ? this._findReview(reviewId) : null;
	}

	private async _updateStatus(id: string, status: Review['status']) {
		const review = this._findReview(id);
		this._clearFeedback();

		if (!review?.apiId) {
			return;
		}

		this.processingReviewId.set(id);

		const response = await this._reviewsService.updateReview(review.apiId, {
			data: {
				author: review.author,
				companyId: review.companyId,
				rating: review.rating,
				text: review.text,
				date: review.date,
				status,
			},
		});

		if (response === null) {
			this._setFeedback('Помилка', 'error');
			this.processingReviewId.set(null);
			return;
		}

		await this._refreshReviews();
		this.processingReviewId.set(null);
		this._setFeedback('Оновлено', 'success');
	}

	private _setFeedback(message: string, tone: 'success' | 'error') {
		this.feedbackMessage.set(message);
		this.feedbackTone.set(tone);
	}

	private _clearFeedback() {
		this.feedbackMessage.set('');
	}
}
