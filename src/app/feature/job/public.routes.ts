import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'jobs',
		loadComponent: () => import('./pages/jobs/jobs.component').then((m) => m.JobsComponent),
	},
	{
		path: 'job/:id',
		loadComponent: () => import('./pages/job/job.component').then((m) => m.JobComponent),
	},
];
