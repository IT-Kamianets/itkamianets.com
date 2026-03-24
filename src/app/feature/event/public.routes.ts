import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'events',
		loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent)
	},
	{
		path: 'event/:id',
		loadComponent: () => import('./pages/event/event.component').then(m => m.EventComponent)
	}
];
