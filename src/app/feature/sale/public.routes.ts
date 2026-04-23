import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'sales',
		data: { title: 'Sales' },
		loadComponent: () => import('./pages/sales/sales.component').then((m) => m.SalesComponent),
	},
	{
		path: 'sale',
		data: { title: 'Sale details' },
		loadComponent: () => import('./pages/sale/sale.component').then((m) => m.SaleComponent),
	},
];
