import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'tests',
		loadComponent: () => import('./pages/tests/tests.component').then((m) => m.TestsComponent),
	},
	{
		path: 'test/:id',
		loadComponent: () => import('./pages/test/test.component').then((m) => m.TestComponent),
	},
];
