import { RenderMode, ServerRoute } from '@angular/ssr';
import { COURSES, COURSE_LESSON_PARAMS } from './feature/course/course.data';
import { SERVICE_IDS } from './feature/service/service.service';

const COMPETITION_PRERENDER_URL =
	process.env['APP_API_URL'] ??
	process.env['API_BASE'] ??
	'https://api.webart.work/api/itcompetition/get';

const toDocsWithId = (payload: unknown): Array<{ _id?: unknown }> => {
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

const toPrerenderIdParams = (docs: Array<{ _id?: unknown }>): Array<{ id: string }> =>
	docs
		.map((doc) => {
			if (typeof doc?._id === 'string') {
				const id = doc._id.trim();
				return id ? { id } : null;
			}

			if (doc?._id && typeof (doc._id as { toString?: () => string }).toString === 'function') {
				const id = (doc._id as { toString: () => string }).toString().trim();
				return id ? { id } : null;
			}

			return null;
		})
		.filter((item): item is { id: string } => !!item);

const MANAGE_CLIENT_ROUTES = [
	'manage',
	'manage/profile',
	'manage/merch',
	'manage/companies',
	'manage/projects',
	'manage/tests',
	'manage/items',
	'manage/schools',
	'manage/jobs',
	'manage/events',
	'manage/competitions',
	'manage/profiles',
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
		path: 'test/:id',
		renderMode: RenderMode.Server,
	},
	{
		path: 'profile/:id',
		renderMode: RenderMode.Server,
	},
	{
		path: 'job/:id',
		renderMode: RenderMode.Server,
	},
	{
		path: 'sales',
		renderMode: RenderMode.Client,
	},
	{
		path: 'sale',
		renderMode: RenderMode.Client,
	},
	{
		path: 'workmap',
		renderMode: RenderMode.Client,
	},
	{
		path: 'services/:id',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => SERVICE_IDS.map((id) => ({ id })),
	},
	{
		path: 'courses/:slug',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => COURSES.map((course) => ({ slug: course.slug })),
	},
	{
		path: 'courses/:courseSlug/lessons/:lessonSlug',
		renderMode: RenderMode.Prerender,
		getPrerenderParams: async () => COURSE_LESSON_PARAMS,
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

				const docs = toDocsWithId(await response.json());
				if (!docs.length) {
					console.error('[prerender] competition payload did not contain a valid docs array');
					return [];
				}

				return toPrerenderIdParams(docs);
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
