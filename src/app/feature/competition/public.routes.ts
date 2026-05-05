import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'competitions',
		loadComponent: () =>
			import('./pages/competitions/competitions.component').then((m) => m.CompetitionsComponent),
	},
	{
		path: 'competition/:id',
		loadComponent: () =>
			import('./pages/competition/competition.component').then((m) => m.CompetitionComponent),
	},
];
