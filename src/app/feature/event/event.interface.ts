import { CrudDocument } from '@wawjs/ngx-crud';

export interface Event extends CrudDocument<Event> {
	name?: string;
	description?: string;
	data: {
		title: string;
		description: string;
		date: string;
		time: string;
		location: string;
		image?: string;
		link?: string;
		type: string;
		price?: number;
		maxSeats?: number;
		bookedSeats?: number;
	};
}

export interface EventBooking extends CrudDocument<EventBooking> {
	data: {
		eventId: string;
		userId?: string;
		userName: string;
		userEmail: string;
		userPhone: string;
		message?: string;
		status: 'pending' | 'confirmed' | 'cancelled';
		seats: number;
	};
}
