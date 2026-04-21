import { RenderMode, ServerRoute } from '@angular/ssr';
import { TEAM_MEMBERS } from './data/team.data';
import { SERVICE_IDS } from './feature/service/service.service';

const MANAGE_CLIENT_ROUTES = [
	'manage',
	'manage/profile',
	'manage/merch',
	'manage/companies',
	'manage/projects',
	'manage/items',
	'manage/schools',
	'manage/jobs',
	'manage/events',
	'manage/competitions',
	'manage/people',
	'manage/manage-options',
	'manage/manage-certificates',
	'manage/cv-generation',
] satisfies string[];

const MANAGE_SERVER_ROUTES = MANAGE_CLIENT_ROUTES.map(
	(path): ServerRoute => ({
		path,
		renderMode: RenderMode.Client,
	}),
);

export const serverRoutes: ServerRoute[] = [
	...MANAGE_SERVER_ROUTES,
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
		path: 'event/:id',
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
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
