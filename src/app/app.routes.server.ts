import { RenderMode, ServerRoute } from '@angular/ssr';
import { TEAM_MEMBERS } from './data/team.data';
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
		path: 'competition/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => {
			try {
				const response = await fetch('https://api.webart.work/api/itcompetition/get');
				if (!response.ok) {
					return [];
				}

				const docs = (await response.json()) as Array<{ _id?: unknown }>;
				if (!Array.isArray(docs)) {
					return [];
				}

				return docs
					.map((doc) => (typeof doc?._id === 'string' ? { id: doc._id } : null))
					.filter((item): item is { id: string } => !!item);
			} catch {
				return [];
			}
		},
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
