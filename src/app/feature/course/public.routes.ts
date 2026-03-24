import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'courses',
		loadComponent: () =>
			import('./pages/courses/courses.component').then((m) => m.CoursesComponent),
	},
];
