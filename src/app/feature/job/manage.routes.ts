import { Routes } from '@angular/router';
import { authenticatedGuard } from '../../feature/user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'jobs',
		canActivate: [authenticatedGuard],
		loadComponent: () =>
			import('./pages/manage-jobs/jobs.component').then((m) => m.JobsComponent),
	},
	{
		path: 'applications',
		canActivate: [authenticatedGuard],
		loadComponent: () =>
			import('./pages/manage-applications/manage-applications.component').then(
				(m) => m.ManageApplicationsComponent,
			),
	},
];
