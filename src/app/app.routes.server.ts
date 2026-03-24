import { RenderMode, ServerRoute } from '@angular/ssr';
import { BUSINESSES } from './data/businesses.data';
import { TEAM_MEMBERS } from './data/team.data';
import { COURSE_LESSON_PARAMS, COURSES } from './feature/course/course.data';
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
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
