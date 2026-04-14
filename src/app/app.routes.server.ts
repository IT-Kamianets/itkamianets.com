import { RenderMode, ServerRoute } from '@angular/ssr';
import { TEAM_MEMBERS } from './data/team.data';
import { SERVICE_IDS } from './feature/service/service.service';

const COMPETITION_PRERENDER_URL =
	process.env['APP_API_URL'] ??
	process.env['API_BASE'] ??
	'https://api.webart.work/api/itcompetition/get';

const toCompetitionDocs = (payload: unknown): Array<{ _id?: unknown }> => {
	if (Array.isArray(payload)) {
		return payload as Array<{ _id?: unknown }>;
	}

	if (payload && typeof payload === 'object') {
		const wrapped =
			(payload as { data?: unknown }).data ??
			(payload as { items?: unknown }).items ??
			(payload as { docs?: unknown }).docs ??
			(payload as { rows?: unknown }).rows;

		if (Array.isArray(wrapped)) {
			return wrapped as Array<{ _id?: unknown }>;
		}
	}

	return [];
};

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
				const response = await fetch(COMPETITION_PRERENDER_URL);
				if (!response.ok) {
					console.error(
						`[prerender] competition fetch failed (${response.status}) from ${COMPETITION_PRERENDER_URL}`,
					);
					return [];
				}

				const docs = toCompetitionDocs(await response.json());
				if (!docs.length) {
					console.error('[prerender] competition payload did not contain a valid docs array');
					return [];
				}

				return docs
					.map((doc) => {
						if (typeof doc?._id === 'string') {
							return { id: doc._id };
						}

						if (doc?._id && typeof (doc._id as { toString?: () => string }).toString === 'function') {
							const id = (doc._id as { toString: () => string }).toString().trim();
							return id ? { id } : null;
						}

						return null;
					})
					.filter((item): item is { id: string } => !!item);
			} catch (error) {
				console.error('[prerender] competition fetch/json error', error);
				return [];
			}
		},
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
