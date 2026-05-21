import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from '@wawjs/ngx-http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Achievement } from './achievement.interface';

@Injectable({
	providedIn: 'root',
})
export class AchievementService {
	private readonly _http = inject(HttpService);
	private readonly _basePath = 'https://api.webart.work/api/itachievement';

	private readonly _achievements = signal<Achievement[]>([]);
	readonly achievements = this._achievements.asReadonly();

	constructor() {
		this.getAll().subscribe();
	}

	getAll(): Observable<Achievement[]> {
		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: unknown) => {
				const items = Array.isArray(response) ? (response as Achievement[]) : [];
				this._achievements.set(items);
				return items;
			}),
			catchError(() => of([])),
		);
	}

	fetchOne(id: string): Observable<Achievement | null> {
		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
			map((item: unknown) => (item ? (item as Achievement) : null)),
			catchError(() => of(null)),
		);
	}

	new(): Partial<Achievement> {
		return {
			name: '',
			description: '',
			data: {},
		};
	}

	create(achievement: Partial<Achievement>): Observable<Achievement | null> {
		const payload = {
			name: achievement.name || '',
			description: achievement.description || '',
			data: achievement.data || {},
		};
		return this._http.post(`${this._basePath}/create`, payload).pipe(
			map((res: unknown) => (res ? (res as Achievement) : null)),
			tap((newAchievement) => {
				if (newAchievement) {
					this._achievements.update((achievements) => [...achievements, newAchievement]);
				}
			}),
			catchError(() => of(null)),
		);
	}

	update(achievement: Achievement): Observable<Achievement | null> {
		const payload = {
			_id: achievement._id,
			name: achievement.name || '',
			description: achievement.description || '',
			data: achievement.data || {},
		};
		return this._http.post(`${this._basePath}/update`, payload).pipe(
			map((res: unknown) => (res ? (res as Achievement) : null)),
			tap((updatedAchievement) => {
				if (updatedAchievement) {
					this._achievements.update((achievements) =>
						achievements.map((a) =>
							a._id === updatedAchievement._id ? updatedAchievement : a,
						),
					);
				}
			}),
			catchError(() => of(null)),
		);
	}

	delete(achievement: Achievement): Observable<boolean> {
		return this._http.post(`${this._basePath}/delete`, { _id: achievement._id }).pipe(
			map((res: unknown) => !!res),
			tap((success) => {
				if (success) {
					this._achievements.update((achievements) =>
						achievements.filter((a) => a._id !== achievement._id),
					);
				}
			}),
			catchError(() => of(false)),
		);
	}
}
