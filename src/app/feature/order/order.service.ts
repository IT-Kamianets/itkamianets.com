import { Injectable } from '@angular/core';
import { CrudService } from 'wacom';
import { Order } from '../merch/merch.interface';

@Injectable({
	providedIn: 'root',
})
export class OrderService extends CrudService<Order> {
	orders = this.getDocs();

	constructor() {
		super({
			name: 'itproductorder',
		});
	}
}
