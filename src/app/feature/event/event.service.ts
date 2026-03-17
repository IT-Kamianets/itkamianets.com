import { Injectable, signal } from '@angular/core';
import { EVENTS, EventCard } from '../../data/events.data';

@Injectable({
	providedIn: 'root',
})
export class EventService {
	readonly events = signal<EventCard[]>(EVENTS);

	add(event: Omit<EventCard, 'id'>) {
		const newEvent = {
			...event,
			id: Math.max(0, ...this.events().map(e => e.id)) + 1,
		};
		this.events.update(events => [newEvent, ...events]);
	}

	update(updatedEvent: EventCard) {
		this.events.update(events =>
			events.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
		);
	}

	delete(id: number) {
		this.events.update(events => events.filter(event => event.id !== id));
	}
}
