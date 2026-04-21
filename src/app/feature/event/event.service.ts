import { Injectable, signal } from '@angular/core';
import { CrudService } from '@wawjs/ngx-crud';
import { Event } from './event.interface';
import { EVENTS } from '../../data/events.data';

@Injectable({
	providedIn: 'root',
})
export class EventService extends CrudService<Event> {
	readonly events = signal<Event[]>([]);

	constructor() {
		super({
			name: 'itevent',
		});
		this.refresh();
	}

	refresh() {
		this.get().subscribe((docs) => {
			if (Array.isArray(docs) && docs.length > 0) {
				this.events.set(docs.map((e) => this._fromDoc(e)));
			} else {
				this.events.set(this._getMockEvents());
			}
		});
	}

	private _fromDoc(doc: any): Event {
		let data = doc.data || {};

		if (typeof data === 'string') {
			try {
				data = JSON.parse(data);
			} catch (e) {
				data = {};
			}
		}

		if (typeof data !== 'object' || data === null) {
			data = {};
		}

		const title = data.title || doc.name || doc.title || '';
		const description = data.description || doc.description || '';
		const date = data.date || (typeof doc.date === 'string' && doc.date.length > 5 ? doc.date : '');
		const time = data.time || (typeof doc.time === 'string' ? doc.time : '');
		const location = data.location || doc.location || '';
		const type = data.type || doc.type || 'Нетворкінг';
		const price = typeof data.price !== 'undefined' ? data.price : (typeof doc.price !== 'undefined' ? doc.price : 0);
		const maxSeats = typeof data.maxSeats !== 'undefined' ? data.maxSeats : (typeof doc.maxSeats !== 'undefined' ? doc.maxSeats : 0);
		const link = data.link || doc.link || '#';
		const image = data.image || doc.image || '';

		return {
			...doc,
			name: title,
			description: description,
			data: {
				...data,
				title,
				description,
				date,
				time,
				location,
				type,
				price,
				maxSeats,
				link,
				image
			},
		} as Event;
	}

	private _getMockEvents(): Event[] {
		return EVENTS.map((e) => ({
			_id: e.id.toString(),
			name: e.title,
			description: e.description,
			data: {
				title: e.title,
				description: e.description,
				date: e.date,
				time: e.time,
				location: e.location,
				image: e.image,
				link: e.link,
				type: e.type,
				price: 0,
				maxSeats: 0,
			},
		})) as Event[];
	}
}
