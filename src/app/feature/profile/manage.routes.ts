import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'profiles',
		canActivate: [authenticatedGuard],
		data: { title: 'Profiles' },
		loadComponent: () =>
			import('./pages/manage-profiles/manage-profiles.component').then(
				(m) => m.ManageProfilesComponent,
			),
	},
];
