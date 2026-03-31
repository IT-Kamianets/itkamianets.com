import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CompanyService } from '../../../company/company.service';
import { ReviewService } from '../../../company/review.service';
import { BreadcrumbComponent, Crumb } from '../../../../shared/components/breadcrumb.component';

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

	private readonly _reviewId = toSignal(
		this._route.paramMap.pipe(map((params) => Number(params.get('id')) || 0)),
		{ initialValue: 0 },
	);

	protected readonly ratingRange = [1, 2, 3, 4, 5];
	protected readonly review = computed(() =>
		this._reviewService.getPublishedById(this._reviewId())(),
	);
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
			.filter((item) => item.companyId === review.companyId && item.id !== review.id)
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
}
