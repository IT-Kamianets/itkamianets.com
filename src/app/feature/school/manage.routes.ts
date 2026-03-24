import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'schools',
		canActivate: [authenticatedGuard],
		loadComponent: () =>
			import('./pages/manage-schools/manage-schools.component').then(
				(m) => m.ManageSchoolsComponent,
			),
	},
];
