import { Injectable, computed, signal } from '@angular/core';
import { Review } from './review.interface';

export const PUBLISHED_REVIEWS: Review[] = [
	{
		id: 1,
		businessId: 'static-1',
		author: 'Марта Соловей',
		rating: 5,
		text: 'Замовляли редизайн корпоративного сайту. Команда швидко зібрала структуру, акуратно пропрацювала адаптив і нормально відпрацювала правки без затягувань.',
		date: '2026-03-18T10:30:00.000Z',
	},
	{
		id: 2,
		businessId: 'static-2',
		author: 'Олег Бондар',
		rating: 4,
		text: 'Сподобалась технічна експертиза і комунікація. Було кілька дрібних затримок по фінальному релізу, але загалом результатом задоволені.',
		date: '2026-03-10T14:15:00.000Z',
	},
	{
		id: 3,
		businessId: 'static-1',
		author: 'Ірина Кушнір',
		rating: 5,
		text: 'Працювали над лендингом для освітнього продукту. Отримали чисту верстку, зрозумілу адмінку і хорошу швидкість завантаження сторінок.',
		date: '2026-02-27T09:00:00.000Z',
	},
	{
		id: 4,
		businessId: 'mock-3',
		author: 'Дмитро Левицький',
		rating: 4,
		text: 'Команда допомогла з аудитом продукту і пріоритизацією беклогу. Особливо корисним був етап передпроєктної аналітики.',
		date: '2026-02-14T16:45:00.000Z',
	},
	{
		id: 5,
		businessId: 'mock-8',
		author: 'Анна Гуменюк',
		rating: 5,
		text: 'Дуже сильний дизайн і уважність до деталей. Після запуску оновленого сервісу конверсія з мобільних пристроїв стала помітно кращою.',
		date: '2026-01-29T12:20:00.000Z',
	},
];

export const REVIEW_IDS = PUBLISHED_REVIEWS.map((review) => review.id.toString());

@Injectable({ providedIn: 'root' })
export class ReviewService {
	readonly reviews = signal<Review[]>(PUBLISHED_REVIEWS);

	add(review: Omit<Review, 'id'>): void {
		const newReview: Review = {
			...review,
			id: Math.max(0, ...this.reviews().map((item) => item.id)) + 1,
		};
		this.reviews.update((reviews) => [...reviews, newReview]);
	}

	getByBusinessId(id: string) {
		return computed(() => this.reviews().filter((review) => review.businessId === id));
	}

	getById(id: number) {
		return computed(() => this.reviews().find((review) => review.id === id) || null);
	}
}
