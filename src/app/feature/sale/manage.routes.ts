import { Routes } from '@angular/router';
import { adminGuard } from '../user/admin.guard';

export const routes: Routes = [
	{
		path: 'sales',
		canActivate: [adminGuard],
		data: { title: 'Sales' },
		loadComponent: () =>
			import('./pages/sales/sales.component').then((m) => m.SalesComponent),
	},
	{
		path: 'sales/:id',
		canActivate: [adminGuard],
		data: { title: 'Sale details' },
		loadComponent: () => import('./pages/sale/sale.component').then((m) => m.SaleComponent),
	},
	{
		path: 'manage-sales',
		canActivate: [adminGuard],
		data: { title: 'Manage sales' },
		loadComponent: () =>
			import('./pages/manage-sales/manage-sales.component').then(
				(m) => m.ManageSalesComponent,
			),
	},
];