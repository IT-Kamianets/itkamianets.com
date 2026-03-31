import { Injectable, signal } from '@angular/core';
import { EVENTS } from '../../data/events.data';
import { Event } from './event.interface';

@Injectable({
	providedIn: 'root',
})
export class EventService {
	readonly events = signal<Event[]>(EVENTS as Event[]);

	add(event: Omit<Event, 'id'>) {
		const newEvent = {
			...event,
			id: Math.max(0, ...this.events().map(e => e.id)) + 1,
		};
		this.events.update(events => [newEvent, ...events]);
	}

	update(updatedEvent: Event) {
		this.events.update(events =>
			events.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
		);
	}

	delete(id: number) {
		this.events.update(events => events.filter(event => event.id !== id));
	}
}
