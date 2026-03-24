import { Routes } from '@angular/router';
import { authenticatedGuard } from './feature/user/authenticated.guard';

export const routes: Routes = [
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
		],
	},
	{
		path: '',
		loadComponent: () => import('./layouts/guest.component').then((m) => m.GuestComponent),
		children: [
			{
				path: 'sign',
				loadComponent: () =>
					import('./pages/sign/sign.component').then((m) => m.SignComponent),
			},
		],
	},
	{
		path: 'manage',
		loadComponent: () => import('./layouts/manage.component').then((m) => m.ManageComponent),
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'profile',
			},
			{
				path: 'profile',
				canActivate: [authenticatedGuard],
				loadComponent: () =>
					import('./pages/manage/profile/profile.component').then(
						(m) => m.ProfileComponent,
					),
			},
			{
				path: 'merch',
				canActivate: [authenticatedGuard],
				data: { title: 'Merch' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
			{
				path: 'orders',
				canActivate: [authenticatedGuard],
				data: { title: 'Orders' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
			{
				path: 'companies',
				canActivate: [authenticatedGuard],
				data: { title: 'Companies' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
			{
				path: 'projects',
				canActivate: [authenticatedGuard],
				data: { title: 'Projects' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
			{
				path: 'articles',
				canActivate: [authenticatedGuard],
				data: { title: 'Articles' },
				loadComponent: () =>
					import('./pages/articles/articles.component').then(
						(m) => m.ArticlesComponent,
					),
			},
			{
				path: 'schools',
				canActivate: [authenticatedGuard],
				data: { title: 'Schools' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
			{
				path: 'jobs',
				canActivate: [authenticatedGuard],
				data: { title: 'Jobs' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
			{
				path: 'events',
				canActivate: [authenticatedGuard],
				data: { title: 'Events' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
			{
				path: 'competitions',
				canActivate: [authenticatedGuard],
				data: { title: 'Competitions' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
