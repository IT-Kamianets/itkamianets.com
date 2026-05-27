import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from '@wawjs/ngx-http';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../user/user.service';
import { MerchProduct } from './merch.interface';

@Injectable({
	providedIn: 'root',
})
export class MerchService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/itproduct';

	readonly products = signal<MerchProduct[]>([]);

	constructor() {
		this.getAll().subscribe((items) => {
			this.products.set(items);
		});
	}

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
			map((item: unknown) => {
				const product = item ? this._mapToProduct(item) : null;
				if (product) {
					this.products.update((items) => [...items, product]);
				}
				return product;
			}),
			catchError(() => of(null)),
		);
	}

	update(data: any): Observable<MerchProduct | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/update`, data).pipe(
			map((item: unknown) => {
				const product = item ? this._mapToProduct(item) : null;
				if (product) {
					this.products.update((items) =>
						items.map((i) => (i._id === product._id ? product : i)),
					);
				}
				return product;
			}),
			catchError(() => of(null)),
		);
	}

	delete(id: string): Observable<boolean> {
		this._syncToken();

		return this._http.post(`${this._basePath}/delete`, { _id: id }).pipe(
			map(() => {
				this.products.update((items) => items.filter((i) => i._id !== id));
				return true;
			}),
			catchError(() => of(false)),
		);
	}

	seedDemoIfEmpty(): void {
		const demoProducts = [
			{
				name: 'Чашка IT-Kamianets',
				price: 250,
				image: 'Cup.png',
				description:
					'Керамічна чашка 330 мл з логотипом IT-Kamianets. Ідеальна для ранкової кави під час кодингу.',
			},
			{
				name: 'Футболка IT-Kamianets',
				price: 550,
				image: 'T-shirt.png',
				description:
					'Бавовняна футболка чорного кольору з мінімалістичним принтом IT-Kamianets на грудях.',
			},
			{
				name: 'Худі IT-Kamianets',
				price: 950,
				image: 'Skinny.png',
				description:
					'Тепле худі з капюшоном та вишитим логотипом IT-Kamianets. Ідеальне для холодних вечорів з кодом.',
			},
			{
				name: 'Кепка IT-Kamianets',
				price: 350,
				image: 'Cap.png',
				description:
					'Стильна кепка з вишитим логотипом IT-Kamianets. Регульований розмір та 100% бавовна.',
			},
			{
				name: 'Шкарпетки IT-Kamianets',
				price: 150,
				image: 'Socks.png',
				description:
					'Комплект з 3 пар шкарпеток з IT-принтами. Ідеальне для холодних вечорів з кодом. Розмір 39–45.',
			},
		];

		demoProducts.forEach((product) => {
			this.create({ data: product }).subscribe();
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
