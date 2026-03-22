import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'projects',
		canActivate: [authenticatedGuard],
		data: { title: 'Projects' },
		loadComponent: () =>
			import('./pages/manage-projects/projects-manage.component').then(
				(m) => m.ProjectsManageComponent,
			),
	},
];
