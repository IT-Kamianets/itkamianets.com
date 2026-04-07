import { Injectable } from '@angular/core';
import { BaseService } from 'wacom';
import { Order } from '../merch/merch.interface';

@Injectable({
	providedIn: 'root'
})
export class OrderService extends BaseService<Order> {
	orders = this.docs;

	constructor() {
		super({
			name: 'itproductorder',
			url: '/api/itproductorder'
		});
	}
}
