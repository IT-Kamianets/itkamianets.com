import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';
import { Sale, SaleData } from './sale.interface';

@Injectable({
	providedIn: 'root',
})
export class SaleService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/itsale';

	getAll(): Observable<Sale[]> {
		this._syncToken();

		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: unknown) => {
				if (!Array.isArray(response)) {
					return [];
				}

				return response.map((item) => this._mapToSale(item));
			}),
			catchError(() => of([])),
		);
	}

	fetchOne(id: string): Observable<Sale | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
			map((item: unknown) => (item ? this._mapToSale(item) : null)),
			catchError(() => of(null)),
		);
	}

	create(payload: Pick<Sale, 'name' | 'description' | 'data'>): Observable<Sale | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/create`, payload).pipe(
			map((item: unknown) => (item ? this._mapToSale(item) : null)),
			catchError(() => of(null)),
		);
	}

	update(id: string, payload: Pick<Sale, 'name' | 'description' | 'data'>): Observable<Sale | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/update`, { _id: id, ...payload }).pipe(
			map((item: unknown) => (item ? this._mapToSale(item) : null)),
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

	private _mapToSale(item: unknown): Sale {
		const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
		const rawId = record['_id'];
		const rawName = record['name'];
		const rawDescription = record['description'];
		const data = this._normalizeData(record['data']);

		return {
			_id: typeof rawId === 'string' ? rawId : rawId ? String(rawId) : '',
			name: typeof rawName === 'string' ? rawName : '',
			description: typeof rawDescription === 'string' ? rawDescription : '',
			data,
		};
	}

	private _normalizeData(data: unknown): SaleData {
		if (data && typeof data === 'object' && !Array.isArray(data)) {
			return data as SaleData;
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