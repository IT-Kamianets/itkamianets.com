import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'quests',
		loadComponent: () =>
			import('../../pages/quests/quests.component').then((m) => m.QuestsComponent),
	},
];
