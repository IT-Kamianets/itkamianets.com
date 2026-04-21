import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'sales',
		data: { title: 'Manage sales' },
		loadComponent: () =>
			import('./pages/manage-sales/manage-sales.component').then(
				(m) => m.ManageSalesComponent,
			),
	},
];
