import { RenderMode, ServerRoute } from '@angular/ssr';
import { BUSINESSES } from './data/businesses.data';

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
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
