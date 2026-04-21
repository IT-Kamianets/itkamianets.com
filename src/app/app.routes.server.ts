import { RenderMode, ServerRoute } from '@angular/ssr';

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
		renderMode: RenderMode.Server,
	},
	{
		path: 'services/:id',
		renderMode: RenderMode.Server,
	},
	{
		path: 'reviews/:id',
		renderMode: RenderMode.Server,
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
