import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from '@wawjs/ngx-http';
import { UserService } from '../user/user.service';
import { Profile } from './profile.types';
import { EventService } from '../event/event.service';

const API = `/api/itprofile`;

@Injectable({ providedIn: 'root' })
export class ProfileService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _eventService = inject(EventService);

	readonly profiles = signal<Profile[]>([]);

	/** Адаптований список івентів для потреб профілю */
	readonly allEvents = computed(() =>
		this._eventService.events().map((e) => ({
			_id: String(e.id),
			title: e.title,
			date: e.date,
			type: e.type,
			location: e.location,
			link: e.link,
		}))
	);

	constructor() {
		this._syncToken();
		this._http.get(`${API}/get`).subscribe({
			next: (docs: unknown) => {
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
		const companyId = profile.company || this.profiles()[0]?.company || '';
		const payload = this._toPayload({ ...profile, company: companyId });
		this._syncToken();
		this._http.post(`${API}/create`, payload).subscribe({
			next: (doc: any) => {
				if (doc?._id) {
					this.profiles.update((list) => [this._fromDoc(doc), ...list]);
				} else {
					console.warn('[ProfileService] add: unexpected response:', doc);
				}
			},
			error: (err: unknown) => console.error('[ProfileService] add error:', err),
		});
	}

	updateProfile(profile: Profile): void {
		const { _id, ...rest } = profile;
		const payload = { _id, ...this._toPayload(rest) };
		this._syncToken();
		this._http.post(`${API}/update`, payload).subscribe({
			next: (doc: any) => {
				this.profiles.update((list) =>
					list.map((p) => (p._id === profile._id ? (doc?._id ? this._fromDoc(doc) : profile) : p)),
				);
			},
			error: (err: unknown) => console.error('[ProfileService] update error:', err),
		});
	}

	deleteProfile(id: string): void {
		this._syncToken();
		this._http.post(`${API}/delete`, { _id: id }).subscribe({
			next: () => {
				this.profiles.update((list) => list.filter((p) => p._id !== id));
			},
		});
	}

	// ─── Private helpers ────────────────────────────────────

	private _toPayload(profile: Omit<Profile, '_id'>) {
		const { name, role, company, ...rest } = profile;
		const payload: Record<string, unknown> = { name, description: role, data: rest };
		// company передається тільки якщо це валідний ObjectId (24 символи)
		if (company && company.length === 24) {
			payload['company'] = company;
		}
		return payload;
	}

	private _fromDoc(doc: any): Profile {
		const data = typeof doc?.data === 'object' && doc.data !== null ? doc.data : {};
		const rawSocials = data.socials ?? {};
		const socials: Record<string, string> =
			typeof rawSocials === 'object' && rawSocials !== null ? { ...rawSocials } : {};

		return {
			...data,
			_id: doc._id,
			name: doc.name ?? '',
			role: doc.description ?? data.role ?? '',
			avatar: data.avatar ?? '',
			isHead: data.isHead ?? false,
			socials,
			bio: data.bio ?? '',
			roles: Array.isArray(data.roles) ? data.roles : [],
			achievements: Array.isArray(data.achievements) ? data.achievements : [],
			projects: Array.isArray(data.projects) ? data.projects : [],
			events: Array.isArray(data.events) ? data.events : [],
			company: doc.company?.toString() ?? '',
			internshipDates: data.internshipDates ?? '',
			university: data.university ?? '',
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
