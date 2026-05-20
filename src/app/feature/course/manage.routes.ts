import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'courses',
		loadComponent: () => import('./pages/manage-courses/manage-courses.page').then(m => m.ManageCoursesPage),
		title: 'Manage Courses',
		data: { admin: true }
	}
];
