import { RenderMode, ServerRoute } from '@angular/ssr';
import { TEAM_MEMBERS } from './data/team.data';
import { REVIEW_IDS } from './feature/business/review.service';
import { SERVICE_IDS } from './feature/service/service.service';

export const serverRoutes: ServerRoute[] = [
	{
		path: 'manage',
		renderMode: RenderMode.Client,
	},
	{
		path: 'manage/**',
		renderMode: RenderMode.Client,
	},
	{
		path: 'company/:id',
		renderMode: RenderMode.Server,
	},
	{
		path: 'certificate/:id',
		renderMode: RenderMode.Server,
	},
	{
		path: 'profile/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => TEAM_MEMBERS.map((p) => ({ id: p.id.toString() })),
	},
	{
		path: 'services/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => SERVICE_IDS.map((id) => ({ id })),
	},
	{
		path: 'reviews/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => REVIEW_IDS.map((id) => ({ id })),
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
