import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'waiters',
		canActivate: [authenticatedGuard],
		data: { title: 'Waiters' },
		loadComponent: () =>
			import('./pages/manage-waiters/waiters-manage.component').then(
				(m) => m.WaitersManageComponent,
			),
	},
];
						