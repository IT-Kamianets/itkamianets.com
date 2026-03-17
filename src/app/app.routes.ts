import { Routes } from '@angular/router';
import { authenticatedGuard } from './feature/user/authenticated.guard';

import { adminGuard } from './feature/user/admin.guard';

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
				path: 'jobs',
				loadComponent: () =>
					import('./pages/jobs/jobs.component').then((m) => m.JobsComponent),
			},
			{
				path: 'projects',
				loadComponent: () =>
					import('./pages/projects/projects.component').then((m) => m.ProjectsComponent),
			},
			
			{
				path: 'education',
				loadComponent: () =>
					import('./pages/education/education.component').then(
						(m) => m.EducationComponent,
					),
			},
			{
			        path: 'hackathons',
			        loadComponent: () =>
			                import('./pages/hackathons/hackathons.component').then(
			                        (m) => m.HackathonsComponent,
			                ),
			},
			{
			        path: 'events',
			        loadComponent: () =>
			                import('./pages/events/events.component').then(
			                        (m) => m.EventsComponent,
			                ),
			},
			{
			        path: 'hackathon',				loadComponent: () =>
					import('./pages/hackathon/hackathon.component').then(
						(m) => m.HackathonComponent,
					),
			},
			{
				path: 'competitions',
				loadComponent: () =>
					import('./pages/competitions/competitions.component').then(
						(m) => m.CompetitionsComponent,
					),
			},
			{
				path: 'competition',
				loadComponent: () =>
					import('./pages/competition/competition.component').then(
						(m) => m.CompetitionComponent,
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
				path: 'events',
				canActivate: [authenticatedGuard],
				loadComponent: () =>
					import('./pages/manage/events/events.component').then(
						(m) => m.ManageEventsComponent,
					),
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
				path: 'schools',
				canActivate: [authenticatedGuard],
				loadComponent: () =>
					import('./pages/manage/shcools/shcools.component').then(
						(m) => m.ShcoolsComponent,
					),
			},
			{
				path: 'merch',
				canActivate: [authenticatedGuard],
				data: { title: 'Merch' },
				loadComponent: () =>
					import('./pages/manage/merch/merch.component').then(
						(m) => m.MerchComponent,
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
					import('./pages/manage/projects-manage/projects-manage.component').then(
						(m) => m.ProjectsManageComponent,
					),
			},
			{
				path: 'articles',
				canActivate: [authenticatedGuard],
				data: { title: 'Articles' },
				loadComponent: () =>
					import('./pages/manage/section/section.component').then(
						(m) => m.SectionComponent,
					),
			},
			
			{
				path: 'jobs',
				canActivate: [authenticatedGuard],
				loadComponent: () =>
					import('./pages/manage/jobs/jobs.component').then(
						(m) => m.JobsComponent,
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
					import('./pages/manage/competitions/competitions.component').then(
						(m) => m.ManageCompetitionsComponent,
					),
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];