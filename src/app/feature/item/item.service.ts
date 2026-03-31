import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';
import { Item, ItemData } from './item.interface';

@Injectable({
	providedIn: 'root',
})
export class ItemService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = 'https://api.webart.work/api/ititem';
	readonly items = signal<Item[]>([]);

	getAll(): Observable<Item[]> {
		this._syncToken();

		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: unknown) => {
				if (!Array.isArray(response)) {
					return [];
				}

				return response.map((item) => this._mapToItem(item));
			}),
			catchError(() => of([])),
		);
	}

	create(data: ItemData): Observable<Item | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/create`, { data }).pipe(
			map((item: unknown) => (item ? this._mapToItem(item) : null)),
			catchError(() => of(null)),
		);
	}

	update(id: string, data: ItemData): Observable<Item | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/update`, { _id: id, data }).pipe(
			map((item: unknown) => (item ? this._mapToItem(item) : null)),
			catchError(() => of(null)),
		);
	}

	delete(id: string): Observable<boolean> {
		this._syncToken();

		return this._http.post(`${this._basePath}/delete`, { _id: id }).pipe(
			map(() => true),
			catchError(() => of(false)),
		);
	}

	fetchOne(id: string): Observable<Item | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
			map((item: unknown) => (item ? this._mapToItem(item) : null)),
			catchError(() => of(null)),
		);
	}

	private _mapToItem(item: unknown): Item {
		const record =
			item && typeof item === 'object' ? (item as { _id?: unknown; data?: unknown }) : {};
		const rawId = record._id;
		const id = typeof rawId === 'string' ? rawId : rawId ? String(rawId) : '';
		const data = this._normalizeData(record.data);

		return { _id: id, data };
	}

	private _normalizeData(data: unknown): ItemData {
		if (data && typeof data === 'object' && !Array.isArray(data)) {
			return data as ItemData;
		}

		return {};
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
