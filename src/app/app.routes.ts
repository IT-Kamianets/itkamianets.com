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
				path: 'jobs',
				loadComponent: () =>
					import('./pages/jobs/jobs.component').then((m) => m.JobsComponent),
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
					import('./pages/events/events.component').then((m) => m.EventsComponent),
			},
			{
				path: 'hackathon',
				loadComponent: () =>
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
				path: 'services',
				loadComponent: () =>
					import('./pages/services/services.component').then(
						(m) => m.ServicesComponent,
					),
			},
			{
				path: 'services/:id',
				loadComponent: () =>
					import('./pages/service-detail/service-detail.component').then(
						(m) => m.ServiceDetailComponent,
					),
			},
			{
				path: 'companies',
				loadComponent: () =>
					import('./feature/company/pages/companies/companies.component').then(
						(m) => m.CompaniesComponent,
					),
			},
			{
				path: 'companies/map',
				loadComponent: () =>
					import('./feature/company/pages/map/map.component').then(
						(m) => m.CompaniesMapComponent,
					),
			},
			{
				path: 'company/:id',
				loadComponent: () =>
					import('./feature/company/pages/company/company.component').then(
						(m) => m.CompanyComponent,
					),
			},
			{
				path: 'profiles',
				loadComponent: () =>
					import('./pages/profiles/profiles.component').then((m) => m.ProfilesComponent),
			},
			{
				path: 'profile/:id',
				loadComponent: () =>
					import('./pages/profile/profile.component').then((m) => m.MemberProfileComponent),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/article/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/merch/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/project/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/school/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/job/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/competition/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/event/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/profile/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/course/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/item/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/test/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/startup/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/quest/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/notification/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/company/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/review/public.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/certificate/public.routes').then((m) => m.routes),
			},
		],
	},
	{
		path: '',
		loadComponent: () =>
			import('./layouts/guest/guest.component').then((m) => m.GuestComponent),
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
		loadComponent: () =>
			import('./layouts/manage/manage.component').then((m) => m.ManageComponent),
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
					import('./pages/manage/merch/merch.component').then((m) => m.MerchComponent),
			},
			{
				path: 'jobs',
				canActivate: [authenticatedGuard],
				loadComponent: () =>
					import('./pages/manage/jobs/jobs.component').then((m) => m.JobsComponent),
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
			{
				path: 'people',
				canActivate: [authenticatedGuard],
				data: { title: 'People' },
				loadComponent: () =>
					import('./pages/manage/people/people.component').then(
						(m) => m.ManagePeopleComponent,
					),
			},
			{
				path: 'cv-generation',
				canActivate: [authenticatedGuard],
				data: { title: 'CV Generation' },
				loadComponent: () =>
					import('./pages/manage/cv-generation/cv-generate.component').then(
						(m) => m.CvGenerateComponent,
					),
			},
			{
				path: 'companies',
				canActivate: [authenticatedGuard],
				loadComponent: () =>
					import('./feature/company/pages/manage-companies/manage-companies.component').then(
						(m) => m.ManageCompaniesComponent,
					),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/article/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/merch/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/project/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/school/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/job/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/competition/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/event/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/profile/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/course/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/item/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/test/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/startup/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/quest/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/notification/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/company/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/review/manage.routes').then((m) => m.routes),
			},
			{
				path: '',
				loadChildren: () =>
					import('./feature/certificate/manage.routes').then((m) => m.routes),
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
