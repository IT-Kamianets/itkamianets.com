import { Injectable } from '@angular/core';
import { CrudService } from 'wacom';
import { MerchProduct } from './merch.interface';

@Injectable({
	providedIn: 'root',
})
export class MerchService extends CrudService<MerchProduct> {
	products = this.getDocs();

	constructor() {
		super({
			name: 'itproduct',
		});

		this.get();
	}
}
