import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../event.service';
import { Event } from '../../event.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-events',
	standalone: true,
	imports: [FormsModule, RouterLink],
	templateUrl: './events.component.html',
	styleUrl: './events.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
	protected readonly eventService = inject(EventService);

	protected readonly events = toSignal(this.eventService.events, { initialValue: [] });

	protected readonly types = computed(() => {
		const types = new Set(this.events().map((e: Event) => e.data.type));
		return ['Усі', ...Array.from(types)];
	});

	protected readonly selectedType = signal<string>('Усі');

	protected readonly filteredEvents = computed(() => {
		const type = this.selectedType();
		const events = this.events();
		if (type === 'Усі') {
			return events;
		}
		return events.filter((e: Event) => e.data.type === type);
	});

	protected readonly upcomingEvents = computed(() => {
		return this.filteredEvents().filter((e: Event) => !this._isPassed(e.data.date));
	});

	protected readonly passedEvents = computed(() => {
		return this.filteredEvents().filter((e: Event) => this._isPassed(e.data.date));
	});

	private _isPassed(dateStr: string): boolean {
		try {
			const months: { [key: string]: number } = {
				'Січня': 0, 'Лютого': 1, 'Березня': 2, 'Квітня': 3, 'Травня': 4, 'Червня': 5,
				'Липня': 6, 'Серпня': 7, 'Вересня': 8, 'Жовтня': 9, 'Листопада': 10, 'Грудня': 11
			};
			const parts = dateStr.split(' ');
			if (parts.length < 3) return false;
			const day = parseInt(parts[0]);
			const month = months[parts[1].replace(',', '')];
			const year = parseInt(parts[2]);
			if (isNaN(day) || month === undefined || isNaN(year)) return false;
			const date = new Date(year, month, day);
			return date < new Date();
		} catch {
			return false;
		}
	}

	selectType(type: string) {
		this.selectedType.set(type);
	}
}
