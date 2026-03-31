import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../feature/event/event.service';
import { Event } from '../../feature/event/event.interface';

@Component({
	selector: 'app-events',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './events.component.html',
	styleUrl: './events.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
	protected readonly eventService = inject(EventService);
	protected readonly events = this.eventService.events;
	protected readonly types = computed(() => ['Усі', ...new Set(this.events().map(e => e.type))]);
	protected readonly selectedType = signal<string>('Усі');
	protected readonly selectedEvent = signal<Event | null>(null);
	protected readonly isRegistering = signal(false);
	protected readonly registrationSuccess = signal(false);

	protected regForm = {
		name: '',
		email: '',
		phone: '',
		message: ''
	};

	protected readonly filteredEvents = computed(() => {
		const type = this.selectedType();
		const events = this.events();
		if (type === 'Усі') {
			return events;
		}
		return events.filter(e => e.type === type);
	});

	selectType(type: string) {
		this.selectedType.set(type);
	}

	openEvent(event: Event) {
		this.selectedEvent.set(event);
		this.isRegistering.set(false);
		this.registrationSuccess.set(false);
		document.body.style.overflow = 'hidden';
	}

	registerForEvent(event: Event) {
		this.selectedEvent.set(event);
		this.regForm = { name: '', email: '', phone: '', message: '' };
		this.isRegistering.set(true);
		this.registrationSuccess.set(false);
		document.body.style.overflow = 'hidden';
	}

	closeEvent() {
		this.selectedEvent.set(null);
		this.isRegistering.set(false);
		this.registrationSuccess.set(false);
		document.body.style.overflow = 'auto';
	}

	startRegistration() {
		this.regForm = { name: '', email: '', phone: '', message: '' };
		this.isRegistering.set(true);
	}

	submitRegistration() {
		console.log('Registration data:', {
			event: this.selectedEvent()?.title,
			...this.regForm
		});
		this.registrationSuccess.set(true);
		this.isRegistering.set(false);
	}
}
