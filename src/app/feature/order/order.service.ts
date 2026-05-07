import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class OrderService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/itproductorder';

	private readonly _orders = signal<any[]>([]);
	readonly orders = computed(() => this._orders());

	constructor() {
		this.getAll().subscribe();
	}

	getAll(): Observable<any[]> {
		this._syncToken();
		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: any) => {
				const items = Array.isArray(response) ? response : [];
				const mapped = items.map((item: any) => ({
					...item,
					...(item.data || {}),
					originalData: item.data
				}));
				this._orders.set(mapped);
				return mapped;
			}),
			catchError(() => {
				this._orders.set([]);
				return of([]);
			}),
		);
	}

	create(data: any): Observable<any> {
		this._syncToken();
		return this._http.post(`${this._basePath}/create`, data).pipe(
			map((item: any) => {
				if (item) {
					const mapped = { _id: item._id, ...(item.data || {}) };
					this._orders.update((items) => [mapped, ...items]);
					return mapped;
				}
				return null;
			}),
			catchError(() => of(null)),
		);
	}

	update(order: any): Observable<any> {
		this._syncToken();
		// Беремо оригінальні дані з data і оновлюємо статус
		const currentData = order.originalData || {};
		const payload = {
			_id: order._id,
			data: {
				...currentData,
				status: order.status
			}
		};
		return this._http.post(`${this._basePath}/update`, payload).pipe(
			map((item: any) => {
				if (item) {
					// Оновлюємо локальний список відразу для швидкості
					this._orders.update(items => items.map(i => i._id === order._id ? { ...i, status: order.status, data: payload.data, originalData: payload.data } : i));
				}
				return item;
			}),
			catchError(() => of(null))
		);
	}

	delete(id: string): Observable<boolean> {
		this._syncToken();
		return this._http.post(`${this._basePath}/delete`, { _id: id }).pipe(
			map(() => {
				this._orders.update((items) => items.filter((i) => i._id !== id));
				return true;
			}),
			catchError(() => of(false)),
		);
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
