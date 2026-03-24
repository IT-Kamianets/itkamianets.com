import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'manage-options',
		loadComponent: () => import('./pages/manage-options/manage-options.component').then(m => m.ManageOptionsComponent)
	},
	{
		path: 'manage-certificates',
		loadComponent: () => import('./pages/manage-certificates/manage-certificates.component').then(m => m.ManageCertificatesComponent)
	}
];
