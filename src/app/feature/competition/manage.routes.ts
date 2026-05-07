import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'competitions',
		canActivate: [authenticatedGuard],
		data: { title: 'Competitions' },
		loadComponent: () =>
			import('./pages/manage-competitions/manage-competitions.component').then(
				(m) => m.ManageCompetitionsComponent,
			),
	},
];
