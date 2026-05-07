import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'manage-options',
		canActivate: [authenticatedGuard],
		loadComponent: () => import('./pages/manage-options/manage-options.component').then(m => m.ManageOptionsComponent)
	},
	{
		path: 'manage-certificates',
		canActivate: [authenticatedGuard],
		loadComponent: () => import('./pages/manage-certificates/manage-certificates.component').then(m => m.ManageCertificatesComponent)
	}
];
