import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'reviews',
		canActivate: [authenticatedGuard],
		data: { title: 'Reviews' },
		loadComponent: () =>
			import('./pages/reviews/reviews.component').then((m) => m.ReviewsComponent),
	},
	{
		path: 'reviews/:id',
		canActivate: [authenticatedGuard],
		data: { title: 'Review' },
		loadComponent: () =>
			import('./pages/review/review.component').then((m) => m.ReviewComponent),
	},
];
