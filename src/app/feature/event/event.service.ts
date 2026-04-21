import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';
import { Event } from './event.interface';

interface EventDoc {
	_id?: string;
	data?: Partial<Event> & {
		type?: string;
	};
	title?: string;
	description?: string;
}

@Injectable({
	providedIn: 'root',
})
export class EventService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/ititem';

	readonly events = signal<Event[]>([]);

	constructor() {
		this.getAll().subscribe();
	}

	getAll(): Observable<Event[]> {
		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: unknown): Event[] => {
				if (!Array.isArray(response)) {
					return [];
				}

				const events = response.map((item) => this._mapEvent(item as EventDoc));

				return events.filter((item): item is Event => item !== null);
			}),
			tap((events) => this.events.set(events)),
			catchError(() => {
				this.events.set([]);
				return of([] as Event[]);
			}),
		);
	}

	add(event: Omit<Event, 'id'>) {
		return this._mutate('create', {
			title: event.title,
			description: event.description,
			data: {
				...event,
				type: 'event',
			},
		}).pipe(
			tap((created) => {
				if (created) {
					this.events.update((events) => [created, ...events]);
				}
			}),
		);
	}

	update(event: Event) {
		return this._mutate('update', {
			_id: event.id,
			title: event.title,
			description: event.description,
			data: {
				...event,
				type: 'event',
			},
		}).pipe(
			tap((updated) => {
				if (updated) {
					this.events.update((events) =>
						events.map((entry) => (entry.id === updated.id ? updated : entry)),
					);
				}
			}),
		);
	}

	delete(id: string) {
		this._syncToken();

		return this._http.post(`${this._basePath}/delete`, { _id: id }).pipe(
			map(() => true),
			tap((success) => {
				if (success) {
					this.events.update((events) => events.filter((event) => event.id !== id));
				}
			}),
			catchError(() => of(false)),
		);
	}

	private _mutate(action: 'create' | 'update', payload: Record<string, unknown>) {
		this._syncToken();

		return this._http.post(`${this._basePath}/${action}`, payload).pipe(
			map((response: unknown) => this._mapEvent(response as EventDoc)),
			catchError(() => of(null)),
		);
	}

	private _mapEvent(doc: EventDoc | null | undefined): Event | null {
		const data = doc?.data || {};

		if (data.type !== 'event') {
			return null;
		}

		const id = doc?._id || data.id;
		if (!id) {
			return null;
		}

		return {
			id: String(id),
			title: data.title || doc?.title || '',
			description: data.description || doc?.description || '',
			date: data.date || '',
			time: data.time || '',
			location: data.location || '',
			image: data.image,
			link: data.link,
			type: data.type || '',
		};
	}

	private _syncToken() {
		const token = this._userService.user().token?.trim() || '';

		if (token) {
			this._http.set('token', token);
		} else {
			this._http.remove('token');
		}
	}
}
