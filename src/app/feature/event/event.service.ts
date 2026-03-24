import { Injectable } from '@angular/core';
import { CrudService } from 'wacom';
import { Event } from './event.interface';

@Injectable({
	providedIn: 'root',
})
export class EventService extends CrudService<Event> {
	readonly events = this.get();

	constructor() {
		super({
			name: 'itevent',
		});
	}
}
