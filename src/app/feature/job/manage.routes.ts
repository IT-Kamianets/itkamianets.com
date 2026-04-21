import { Routes } from '@angular/router';
import { authenticatedGuard } from '../../feature/user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'jobs',
		canActivate: [authenticatedGuard],
		loadComponent: () =>
			import('./pages/manage-jobs/manage-jobs.component').then((m) => m.ManageJobsComponent),
	},
	{
		path: 'applications',
		canActivate: [authenticatedGuard],
		loadComponent: () =>
			import('./pages/manage-applications/manage-job-proposals.component').then(
				(m) => m.ManageJobProposalsComponent,
			),
	},
];
