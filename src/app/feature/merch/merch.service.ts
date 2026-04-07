import { Injectable } from '@angular/core';
import { BaseService } from 'wacom';
import { MerchProduct } from './merch.interface';

@Injectable({
	providedIn: 'root'
})
export class MerchService extends BaseService<MerchProduct> {
	products = this.docs;

	constructor() {
		super({
			name: 'itproduct',
			url: '/api/itproduct'
		});

		// Примусово завантажуємо дані з фільтром проекту
		this.load();
	}
}
