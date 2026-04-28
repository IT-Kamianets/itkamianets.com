import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'orders',
		canActivate: [authenticatedGuard],
		data: { title: 'Orders' },
		loadComponent: () =>
			import('./pages/manage-orders/manage-orders.component').then(
				(m) => m.ManageOrdersComponent,
			),
	},
];
