import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'certificates',
		loadComponent: () => import('./pages/certificates/certificates.component').then(m => m.CertificatesComponent)
	},
	{
		path: 'certificate/:id',
		loadComponent: () => import('./pages/certificate/certificate.component').then(m => m.CertificateComponent)
	}
];
