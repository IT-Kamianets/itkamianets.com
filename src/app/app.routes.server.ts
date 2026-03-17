import { RenderMode, ServerRoute } from '@angular/ssr';
import { BUSINESSES } from './data/businesses.data';

export const serverRoutes: ServerRoute[] = [
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
