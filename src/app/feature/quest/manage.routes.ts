import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'quests',
		canActivate: [authenticatedGuard],
		data: { title: 'Quests' },
		loadComponent: () =>
			import('../../pages/manage/quests/quests.component').then(
				(m) => m.ManageQuestsComponent,
			),
	},
];
