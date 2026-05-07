import { Injectable, computed, signal } from '@angular/core';
import { Review } from './review.interface';

@Injectable({ providedIn: 'root' })
export class ReviewService {
	readonly reviews = signal<Review[]>([]);

	add(review: Omit<Review, 'id'>): void {
		const newReview: Review = {
			...review,
			id: Math.max(0, ...this.reviews().map(r => r.id)) + 1,
		};
		this.reviews.update(reviews => [...reviews, newReview]);
	}

	getByCompanyId(id: string) {
		return computed(() => this.reviews().filter(r => r.companyId === id));
	}
}
