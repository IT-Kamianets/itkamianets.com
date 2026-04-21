import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';
import { MerchProduct } from './merch.interface';

@Injectable({
	providedIn: 'root',
})
export class MerchService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/itproduct';

	getAll(): Observable<MerchProduct[]> {
		this._syncToken();

		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: unknown) => {
				if (!Array.isArray(response)) {
					return [];
				}

				return response.map((item) => this._mapToProduct(item));
			}),
			catchError(() => of([])),
		);
	}

	create(data: any): Observable<MerchProduct | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/create`, data).pipe(
			map((item: unknown) => (item ? this._mapToProduct(item) : null)),
			catchError(() => of(null)),
		);
	}

	update(data: any): Observable<MerchProduct | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/update`, data).pipe(
			map((item: unknown) => (item ? this._mapToProduct(item) : null)),
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

	seedDemoIfEmpty(): void {
		this.getAll().subscribe((items) => {
			if (items.length === 0) {
				const demoProducts = [
					{
						name: 'Чашка IT-Kamianets',
						price: 250,
						image: 'assets/Cup.png',
						description: 'Керамічна чашка 330 мл з логотипом IT-Kamianets.',
					},
					{
						name: 'Футболка IT-Kamianets',
						price: 550,
						image: 'assets/T-shirt.png',
						description: 'Бавовняна футболка чорного кольору.',
					},
				];

				demoProducts.forEach((product) => {
					this.create({ data: product }).subscribe();
				});
			}
		});
	}

	private _mapToProduct(item: any): MerchProduct {
		const data = item.data || {};
		return {
			_id: item._id,
			name: item.name || data.name || '',
			price: item.price || data.price || 0,
			description: item.description || data.description || '',
			image: item.image || data.image || '',
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
