import { RenderMode, ServerRoute } from '@angular/ssr';
import { BUSINESSES } from './data/businesses.data';
import { TEAM_MEMBERS } from './data/team.data';

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
		path: 'businesses/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => BUSINESSES.map((b) => ({ id: b.id })),
	},
	{
		path: 'profile/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => TEAM_MEMBERS.map((p) => ({ id: p.id.toString() })),
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
