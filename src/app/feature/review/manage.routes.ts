import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'reviews',
		canActivate: [authenticatedGuard],
		data: { title: 'Reviews' },
		loadComponent: () =>
			import('./pages/manage-reviews/manage-reviews.component').then(
				(m) => m.ManageReviewsComponent,
			),
	},
];
