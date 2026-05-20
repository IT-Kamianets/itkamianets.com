import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'courses',
		loadComponent: () =>
			import('./pages/courses/courses.component').then((m) => m.CoursesComponent),
	},
	{
		path: 'courses/:slug',
		loadComponent: () =>
			import('./pages/course/course.component').then((m) => m.CourseComponent),
	},
	{
		path: 'courses/:courseSlug/lessons/:lessonSlug',
		loadComponent: () =>
			import('./pages/lesson/lesson.component').then((m) => m.LessonComponent),
	},
];
