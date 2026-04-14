import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';
import { Profile } from './profile.types';
import { EventService } from '../event/event.service';
import { computed } from '@angular/core';

const API = `/api/itprofile`;
const EVENT_API = `/api/itevent`;

@Injectable({ providedIn: 'root' })
export class ProfileService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);

	private readonly _eventService = inject(EventService);

	readonly profiles = signal<Profile[]>([]);
	
	// Зберігаємо івенти для потреб профілю, використовуючи загальний сервіс івентів
	readonly allEvents = computed(() => {
		return this._eventService.events().map(e => ({
			_id: String(e.id),
			title: e.title,
			date: e.date,
			type: e.type,
			location: e.location,
			link: e.link,
		}));
	});

	constructor() {
		this._syncToken();
		this._http.get(`${API}/get`).subscribe({
			next: (docs) => {
				if (Array.isArray(docs)) {
					this.profiles.set(docs.map((d) => this._fromDoc(d)));
				}
			},
		});
	}

	fetchById(id: string): Observable<Profile | null> {
		this._syncToken();
		return this._http.post(`${API}/fetch`, { _id: id }).pipe(
			map((doc: any) => (doc?._id ? this._fromDoc(doc) : null)),
			catchError(() => of(null)),
		);
	}

	add(profile: Omit<Profile, '_id'>): void {
		// Якщо компанія не передана — беремо з першого завантаженого профілю
		const companyId = profile.company || this.profiles()[0]?.company || '';
		const payload = this._toPayload({ ...profile, company: companyId });
		console.log('[ProfileService] add payload:', payload);
		this._syncToken();
		this._http.post(`${API}/create`, payload).subscribe({
			next: (doc: any) => {
				console.log('[ProfileService] add response:', doc);
				if (doc?._id) {
					this.profiles.update((list) => [this._fromDoc(doc), ...list]);
				} else {
					console.warn('[ProfileService] add: бекенд повернув не валідний документ:', doc);
				}
			},
			error: (err) => console.error('[ProfileService] add error:', err),
		});
	}

	updateProfile(profile: Profile): void {
		const { _id, ...rest } = profile;
		const payload = { _id, ...this._toPayload(rest) };
		console.log('[ProfileService] update payload:', payload);
		this._syncToken();
		this._http
			.post(`${API}/update`, payload)
			.subscribe({
				next: (doc: any) => {
					console.log('[ProfileService] update response:', doc);
					this.profiles.update((list) =>
						list.map((c) => (c._id === profile._id ? (doc?._id ? this._fromDoc(doc) : profile) : c)),
					);
				},
				error: (err) => console.error('[ProfileService] update error:', err),
			});
	}

	deleteProfile(id: string): void {
		this._syncToken();
		this._http.post(`${API}/delete`, { _id: id }).subscribe({
			next: () => {
				this.profiles.update((list) => list.filter((c) => c._id !== id));
			},
		});
	}

	private _toPayload(profile: Omit<Profile, '_id'>) {
		const { name, role, company, ...rest } = profile;
		const payload: Record<string, unknown> = { name, description: role, data: rest };
		// Додаємо company тільки якщо це валідний ObjectId (не порожний рядок)
		// Інакше Mongoose кине CastError і бекенд поверне false
		if (company && company.length === 24) {
			payload['company'] = company;
		}
		return payload;
	}

	private _fromDoc(doc: any): Profile {
		const rawData = typeof doc?.data === 'object' && doc.data !== null ? doc.data : {};

		const rawSocials = rawData.socials ?? {};
		const socials: Record<string, string> =
			typeof rawSocials === 'object' && rawSocials !== null ? { ...rawSocials } : {};

		return {
			...rawData,
			_id: doc._id,
			name: doc.name ?? '',
			role: doc.description ?? rawData.role ?? '',
			avatar: rawData.avatar ?? '',
			isHead: rawData.isHead ?? false,
			socials,
			bio: rawData.bio ?? '',
			roles: Array.isArray(rawData.roles) ? rawData.roles : [],
			achievements: Array.isArray(rawData.achievements) ? rawData.achievements : [],
			projects: Array.isArray(rawData.projects) ? rawData.projects : [],
			events: Array.isArray(rawData.events) ? rawData.events : [],
			company: doc.company?.toString() ?? '',
			internshipDates: rawData.internshipDates ?? '',
			university: rawData.university ?? '',
		};
	}

	private _syncToken(): void {
		const token = this._userService.user().token?.trim() || '';
		if (token) {
			this._http.set('token', token);
		} else {
			this._http.remove('token');
		}
	}
}
