import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'tests',
		canActivate: [authenticatedGuard],
		data: { title: 'Tests' },
		loadComponent: () =>
			import('./pages/manage-tests/manage-tests.component').then(
				(m) => m.ManageTestsComponent,
			),
	},
];
