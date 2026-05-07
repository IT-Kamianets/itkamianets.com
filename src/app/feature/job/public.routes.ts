import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'jobs',
		loadComponent: () => import('./pages/jobs/public-jobs.component').then((m) => m.PublicJobsComponent),
	},
	{
		path: 'job/:id',
		loadComponent: () => import('./pages/job/public-job.component').then((m) => m.PublicJobComponent),
	},
];
