import { Injectable } from '@angular/core';
import { CrudService } from '@wawjs/ngx-crud';
import { EventBooking } from './event.interface';

@Injectable({
	providedIn: 'root',
})
export class EventBookingService extends CrudService<EventBooking> {
	readonly bookings = this.get();

	constructor() {
		super({
			name: 'iteventbooking',
		});
	}
}
