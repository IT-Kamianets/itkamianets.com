import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../event.service';
import { Event } from '../../event.interface';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-events',
	standalone: true,
	imports: [FormsModule, RouterLink, CommonModule],
	templateUrl: './events.component.html',
	styleUrl: './events.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
	protected readonly eventService = inject(EventService);

	protected readonly types = computed(() => {
		const types = new Set(this.eventService.events().map((e: Event) => e.data.type));
		return ['Усі', ...Array.from(types)];
	});

	protected readonly selectedType = signal<string>('Усі');

	protected readonly filteredEvents = computed(() => {
		const type = this.selectedType();
		const events = this.eventService.events();
		if (type === 'Усі') return events;
		return events.filter((e: Event) => e.data.type === type);
	});

	protected readonly upcomingEvents = computed(() => {
		return this.filteredEvents().filter((e: Event) => !this._isPassed(e.data.date));
	});

	protected readonly passedEvents = computed(() => {
		return this.filteredEvents().filter((e: Event) => this._isPassed(e.data.date));
	});

	private _isPassed(dateStr: string): boolean {
		if (!dateStr) return false;
		try {
			if (dateStr.includes('.')) {
				const parts = dateStr.split('.');
				if (parts.length >= 2) {
					const day = parseInt(parts[0]);
					const month = parseInt(parts[1]) - 1;
					const year = parts[2] ? parseInt(parts[2]) : new Date().getFullYear();
					if (!isNaN(day) && !isNaN(month)) return new Date(year, month, day) < new Date();
				}
			}
			const months: { [key: string]: number } = {
				'Січня': 0, 'Лютого': 1, 'Березня': 2, 'Квітня': 3, 'Травня': 4, 'Червня': 5,
				'Липня': 6, 'Серпня': 7, 'Вересня': 8, 'Жовтня': 9, 'Листопада': 10, 'Грудня': 11
			};
			const parts = dateStr.split(' ');
			if (parts.length < 2) return false;
			const day = parseInt(parts[0]);
			const month = months[parts[1].replace(',', '')];
			const year = parts[2] ? parseInt(parts[2]) : new Date().getFullYear();
			if (isNaN(day) || month === undefined) return false;
			return new Date(year, month, day) < new Date();
		} catch {
			return false;
		}
	}

	selectType(type: string) {
		this.selectedType.set(type);
	}
}
