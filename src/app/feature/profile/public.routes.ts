import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'profiles',
		loadComponent: () =>
			import('./pages/profiles/profiles.component').then((m) => m.ProfilesComponent),
	},
	{
		path: 'profile/:id',
		loadComponent: () =>
			import('./pages/profile/profile-detail.component').then(
				(m) => m.ProfileDetailComponent,
			),
	},
];
