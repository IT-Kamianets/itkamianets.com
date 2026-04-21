import { ChangeDetectionStrategy, Component, computed, inject, signal, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../event.service';
import { EventBookingService } from '../../event-booking.service';
import { Event, EventBooking } from '../../event.interface';
import { UserService } from '../../../user/user.service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-event',
	standalone: true,
	imports: [FormsModule, RouterLink, CommonModule],
	templateUrl: './event.component.html',
	styleUrl: './event.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventComponent implements OnInit {
	private readonly _route = inject(ActivatedRoute);
	private readonly _eventService = inject(EventService);
	private readonly _eventBookingService = inject(EventBookingService);
	private readonly _userService = inject(UserService);

	readonly id = input.required<string>();

	protected readonly event = computed(() => {
		const id = this.id();
		return this._eventService.events().find((e: Event) => e._id === id) || null;
	});

	protected readonly isRegistering = signal(false);
	protected readonly registrationSuccess = signal(false);
	protected readonly linkCopied = signal(false);

	protected regForm = {
		name: '',
		email: '',
		phone: '',
		message: '',
		seats: 1
	};

	ngOnInit() {
		this._route.queryParams.subscribe(params => {
			if (params['booking']) {
				this.startRegistration();
			}
		});

		const user = this._userService.user();
		if (user && user._id) {
			this.regForm.name = user.name;
			this.regForm.email = user.email;
		}
	}

	startRegistration() {
		this.isRegistering.set(true);
	}

	submitRegistration() {
		const event = this.event();
		if (!event || !event._id) return;

		const booking: Partial<EventBooking> = {
			data: {
				eventId: event._id,
				userName: this.regForm.name,
				userEmail: this.regForm.email,
				userPhone: this.regForm.phone,
				message: this.regForm.message,
				seats: this.regForm.seats,
				status: 'pending'
			}
		};

		this._eventBookingService.create(booking as EventBooking).subscribe(() => {
			this.registrationSuccess.set(true);
			this.isRegistering.set(false);
		});
	}

	copyLink() {
		const url = window.location.href;
		navigator.clipboard.writeText(url).then(() => {
			this.linkCopied.set(true);
			setTimeout(() => this.linkCopied.set(false), 2000);
		});
	}
}
