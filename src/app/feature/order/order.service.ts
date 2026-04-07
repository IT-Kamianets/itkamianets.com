import { Injectable, computed } from '@angular/core';
import { CrudService } from 'wacom';
import { Order } from '../merch/merch.interface';

@Injectable({
	providedIn: 'root',
})
export class OrderService extends CrudService<Order> {
	orders = computed(() => {
		return this.getSignals('', undefined)().map((sig) => sig());
	});

	constructor() {
		super({
			name: 'itproductorder'
		});
	}
}
