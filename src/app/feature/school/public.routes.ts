import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'schools',
		loadComponent: () =>
			import('./pages/schools/schools.component').then((m) => m.SchoolsComponent),
	},
];
