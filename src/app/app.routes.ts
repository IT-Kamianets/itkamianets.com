import { Routes } from '@angular/router';
import { Public } from './layouts/public/public';
import { Home } from './pages/home/home';
import { Proposals } from './pages/proposals/proposals';
import { OurTeam } from './pages/our-team/our-team';
import { OurProjects } from './pages/our-projects/our-projects';
import { Order } from './pages/order/order';

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
				path: 'proposals',
				component: Proposals,
			},
			{
				path: 'our-team',
				component: OurTeam,
			},
			{
				path: 'our-projects',
				component: OurProjects,
			},
			{
				path: 'order',
				component: Order,
			},
		],
	},
	{
		path: '**',
		redirectTo: '',
	},
];
