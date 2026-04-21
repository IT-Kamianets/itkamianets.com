import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EventBookingService } from '../../event-booking.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventBooking } from '../../event.interface';

@Component({
	selector: 'app-manage-bookings',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './manage-bookings.component.html',
	styleUrl: './manage-bookings.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageBookingsComponent {
	protected readonly bookingService = inject(EventBookingService);
	protected readonly bookings = toSignal(this.bookingService.bookings, { initialValue: [] });

	delete(booking: EventBooking) {
		if (confirm('Ви впевнені, що хочете видалити це бронювання?')) {
			this.bookingService.delete(booking).subscribe();
		}
	}

	updateStatus(booking: EventBooking, status: 'pending' | 'confirmed' | 'cancelled') {
		this.bookingService.update({
			...booking,
			data: {
				...booking.data,
				status
			}
		}).subscribe();
	}
}
