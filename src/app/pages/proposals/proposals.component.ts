import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../../feature/service/service.service';
import { Service } from '../../feature/service/service.interface';

@Component({
	selector: 'app-proposals',
	imports: [DecimalPipe, ReactiveFormsModule],
	templateUrl: './proposals.component.html',
	styleUrl: './proposals.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalsComponent {
	private readonly serviceService = inject(ServiceService);
	private readonly fb = inject(FormBuilder);

	readonly services = this.serviceService.services;
	readonly isBookingOpen = signal(false);
	readonly selectedService = signal<Service | null>(null);

	readonly bookingForm = this.fb.group({
		name: ['', [Validators.required, Validators.minLength(2)]],
		email: ['', [Validators.required, Validators.email]],
		phone: ['', [Validators.required]],
		message: ['', [Validators.required, Validators.minLength(10)]],
	});

	getProviderAvatar(avatar: string): string {
		return `developer/${avatar}.png`;
	}

	onBook(service: Service): void {
		this.selectedService.set(service);
		this.isBookingOpen.set(true);
	}

	closeBooking(): void {
		this.isBookingOpen.set(false);
		this.selectedService.set(null);
		this.bookingForm.reset();
	}

	onSubmit(): void {
		if (this.bookingForm.valid) {
			console.log('Booking submitted:', {
				service: this.selectedService()?.title,
				provider: this.selectedService()?.provider.name,
				data: this.bookingForm.value
			});
			// Here you would typically call a service to save the lead
			alert('Дякуємо! Ваша заявка прийнята. Ми зв’яжемося з вами найближчим часом.');
			this.closeBooking();
		} else {
			this.bookingForm.markAllAsTouched();
		}
	}
}
