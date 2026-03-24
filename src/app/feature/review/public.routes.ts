import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'reviews',
		loadComponent: () =>
			import('./pages/reviews/reviews.component').then((m) => m.ReviewsComponent),
	},
	{
		path: 'reviews/:id',
		loadComponent: () =>
			import('./pages/review/review.component').then((m) => m.ReviewComponent),
	},
];
