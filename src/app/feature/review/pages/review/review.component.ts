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
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';
import { CompanyService } from '../../../company/company.service';
import { fetchReview } from '../../api/reviews';

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
	private readonly _companyService = inject(CompanyService);
	private readonly _reviewResponse = signal<ApiReviewData | null>(null);

	protected readonly isLoading = signal(true);
	protected readonly errorMessage = signal('');
	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly skeletonBlocks = Array.from({ length: 3 }, (_, index) => index);

	private readonly _reviewId = toSignal(
		this._route.paramMap.pipe(map((params) => params.get('id') || '')),
		{ initialValue: '' },
	);

	constructor() {
		effect(() => {
			const reviewId = this._reviewId();

			if (!reviewId) {
				this.isLoading.set(false);
				this.errorMessage.set('Некоректне посилання на відгук.');
				this._reviewResponse.set(null);
				return;
			}

			void this._loadReview(reviewId);
		});
	}

	protected readonly review = computed<ReviewDetail | null>(() => {
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
			text: this._normalizeText(data.text || ''),
			date: data.date || new Date().toISOString(),
			status: data.status || '',
		};
	});

	protected readonly company = computed(() => {
		const review = this.review();
		if (!review) {
			return null;
		}

		return this._companyService.companies().find((company) => company.id === review.companyId) || null;
	});

	protected readonly reviewSummary = computed(() => {
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

	protected async retryLoad() {
		const reviewId = this._reviewId();
		if (!reviewId) {
			return;
		}

		await this._loadReview(reviewId);
	}

	protected getStatusLabel(status: string) {
		if (status === 'published') {
			return 'Опубліковано';
		}

		if (status === 'pending') {
			return 'На перевірці';
		}

		if (status === 'rejected') {
			return 'Відхилено';
		}

		return 'Невідомо';
	}

	private async _loadReview(id: string) {
		this.isLoading.set(true);
		this.errorMessage.set('');
		this._reviewResponse.set(null);

		try {
			const response = await fetchReview<ApiReviewData>(id);

			if (!response?.data) {
				throw new Error('Відгук не знайдено.');
			}

			this._reviewResponse.set(response);
		} catch (error) {
			console.error(error);
			this._reviewResponse.set(null);
			this.errorMessage.set('Відгук не знайдено або він більше недоступний.');
		} finally {
			this.isLoading.set(false);
		}
	}

	private _normalizeRating(value: number | string | undefined): 1 | 2 | 3 | 4 | 5 {
		const normalized = Math.min(5, Math.max(1, Number(value) || 5));

		return normalized as 1 | 2 | 3 | 4 | 5;
	}

	private _normalizeText(value: string) {
		return value.replace(/\s+/g, ' ').trim();
	}
}
