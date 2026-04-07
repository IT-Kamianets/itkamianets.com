import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'items',
		canActivate: [authenticatedGuard],
		data: { title: 'Items' },
		loadComponent: () =>
			import('./pages/manage-items/items-manage.component').then(
				(m) => m.ItemsManageComponent,
			),
	},
];
