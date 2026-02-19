import { Routes } from '@angular/router';
import { Public } from './layouts/public/public';
import { Home } from './pages/home/home';
import { Projects } from './pages/projects/projects';
import { Team } from './pages/team/team';
import { News } from './pages/news/news';
import { Merch } from './pages/merch/merch';
import { Proposals } from './pages/proposals/proposals';

export const routes: Routes = [
	{
		path: '',
		component: Public,
		children: [
			{
				path: '',
				component: Home,
			},
			{
				path: 'projects',
				component: Projects,
			},
			{
				path: 'team',
				component: Team,
			},
			{
				path: 'news',
				component: News,
			},
			{
				path: 'merch',
				component: Merch,
			},
			{
				path: 'proposals',
				component: Proposals,
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
