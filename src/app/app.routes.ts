import { Routes } from '@angular/router';
import { authenticatedGuard } from './feature/user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'sign',
		loadComponent: () =>
			import('./pages/sign/sign.component').then((m) => m.SignComponent),
	},
	{
		path: '',
		loadComponent: () =>
			import('./layouts/public/public.component').then((m) => m.PublicComponent),
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./pages/home/home.component').then((m) => m.HomeComponent),
			},
			{
				path: 'manage/profile',
				canActivate: [authenticatedGuard],
				loadComponent: () =>
					import('./pages/manage/profile/profile.component').then(
						(m) => m.ProfileComponent,
					),
			},
			{
				path: 'projects',
				loadComponent: () =>
					import('./pages/projects/projects.component').then((m) => m.ProjectsComponent),
			},
			{
				path: 'hackathons',
				loadComponent: () =>
					import('./pages/hackathons/hackathons.component').then(
						(m) => m.HackathonsComponent,
					),
			},
			{
				path: 'hackathon',
				loadComponent: () =>
					import('./pages/hackathon/hackathon.component').then(
						(m) => m.HackathonComponent,
					),
			},
			{
				path: 'team',
				loadComponent: () =>
					import('./pages/team/team.component').then((m) => m.TeamComponent),
			},
			{
				path: 'news',
				loadComponent: () =>
					import('./pages/news/news.component').then((m) => m.NewsComponent),
			},
			{
				path: 'merch',
				loadComponent: () =>
					import('./pages/merch/merch.component').then((m) => m.MerchComponent),
			},
			{
				path: 'proposals',
				loadComponent: () =>
					import('./pages/proposals/proposals.component').then(
						(m) => m.ProposalsComponent,
					),
			},
			{
				path: 'businesses',
				loadComponent: () =>
					import('./pages/businesses/businesses.component').then(
						(m) => m.BusinessesComponent,
					),
			},
			{
				path: 'businesses/:id',
				loadComponent: () =>
					import('./pages/business/business.component').then(
						(m) => m.BusinessComponent,
					),
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
