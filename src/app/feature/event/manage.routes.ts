import { Routes } from '@angular/router';
import { authenticatedGuard } from '../user/authenticated.guard';

export const routes: Routes = [
	{
		path: 'events',
		canActivate: [authenticatedGuard],
		loadComponent: () => import('./pages/manage-events/manage-events.component').then(m => m.ManageEventsComponent)
	},
	{
		path: 'bookings',
		canActivate: [authenticatedGuard],
		loadComponent: () => import('./pages/manage-bookings/manage-bookings.component').then(m => m.ManageBookingsComponent)
	}
];
