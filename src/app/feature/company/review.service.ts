import { Injectable, computed, signal } from '@angular/core';
import { Review } from './review.interface';

export const PUBLISHED_REVIEWS: Review[] = [
	{
		id: 1,
		companyId: 'static-1',
		author: 'Марта Соловей',
		rating: 5,
		text: 'Замовляли редизайн корпоративного сайту. Команда швидко зібрала структуру, акуратно пропрацювала адаптив і нормально відпрацювала правки без затягувань.',
		date: '2026-03-18T10:30:00.000Z',
		status: 'approved',
	},
	{
		id: 2,
		companyId: 'static-2',
		author: 'Олег Бондар',
		rating: 4,
		text: 'Сподобалась технічна експертиза і комунікація. Було кілька дрібних затримок по фінальному релізу, але загалом результатом задоволені.',
		date: '2026-03-10T14:15:00.000Z',
		status: 'approved',
	},
	{
		id: 3,
		companyId: 'static-1',
		author: 'Ірина Кушнір',
		rating: 5,
		text: 'Працювали над лендингом для освітнього продукту. Отримали чисту верстку, зрозумілу адмінку і хорошу швидкість завантаження сторінок.',
		date: '2026-02-27T09:00:00.000Z',
		status: 'approved',
	},
	{
		id: 4,
		companyId: 'mock-3',
		author: 'Дмитро Левицький',
		rating: 4,
		text: 'Команда допомогла з аудитом продукту і пріоритизацією беклогу. Особливо корисним був етап передпроєктної аналітики.',
		date: '2026-02-14T16:45:00.000Z',
		status: 'pending',
	},
	{
		id: 5,
		companyId: 'mock-8',
		author: 'Анна Гуменюк',
		rating: 5,
		text: 'Дуже сильний дизайн і уважність до деталей. Після запуску оновленого сервісу конверсія з мобільних пристроїв стала помітно кращою.',
		date: '2026-01-29T12:20:00.000Z',
		status: 'approved',
	},
	{
		id: 6,
		companyId: 'mock-5',
		author: 'Сергій Нечай',
		rating: 2,
		text: 'Команда відповіла не на всі питання по підтримці після запуску, а частину задач довелося перепогоджувати окремо. Відгук залишаю для перевірки модератором.',
		date: '2026-01-18T08:10:00.000Z',
		status: 'rejected',
	},
];

export const REVIEW_IDS = PUBLISHED_REVIEWS
	.filter((review) => review.status === 'approved')
	.map((review) => review.id.toString());

@Injectable({ providedIn: 'root' })
export class ReviewService {
	readonly reviews = signal<Review[]>(PUBLISHED_REVIEWS);
	readonly publishedReviews = computed(() =>
		this.reviews().filter((review) => review.status === 'approved'),
	);

	add(review: Omit<Review, 'id' | 'status'> & Partial<Pick<Review, 'status'>>): void {
		const newReview: Review = {
			...review,
			id: Math.max(0, ...this.reviews().map((item) => item.id)) + 1,
			status: review.status || 'pending',
		};
		this.reviews.update((reviews) => [...reviews, newReview]);
	}

	getBycompanyId(id: string) {
		return computed(() =>
			this.publishedReviews().filter((review) => review.companyId === id),
		);
	}

	getById(id: number) {
		return computed(() => this.reviews().find((review) => review.id === id) || null);
	}

	getPublishedById(id: number) {
		return computed(() => this.publishedReviews().find((review) => review.id === id) || null);
	}

	create(review: Omit<Review, 'id'>) {
		const newReview: Review = {
			...review,
			id: Math.max(0, ...this.reviews().map((item) => item.id)) + 1,
		};

		this.reviews.update((reviews) => [newReview, ...reviews]);

		return newReview;
	}

	update(id: number, payload: Omit<Review, 'id'>) {
		this.reviews.update((reviews) =>
			reviews.map((review) => (review.id === id ? { ...payload, id } : review)),
		);
	}

	setStatus(id: number, status: Review['status']) {
		this.reviews.update((reviews) =>
			reviews.map((review) => (review.id === id ? { ...review, status } : review)),
		);
	}

	delete(id: number) {
		this.reviews.update((reviews) => reviews.filter((review) => review.id !== id));
	}
}
