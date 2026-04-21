import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../feature/event/event.service';
import { Event } from '../../../feature/event/event.interface';

@Component({
	selector: 'app-manage-events',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './events.component.html',
	styleUrl: './events.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEventsComponent {
	protected readonly eventService = inject(EventService);
	protected readonly events = this.eventService.events;

	protected isModalOpen = signal(false);
	protected editingEvent = signal<Event | null>(null);

	protected form = {
		title: '',
		description: '',
		date: '',
		time: '',
		location: '',
		type: 'РќРµС‚РІРѕСЂРєС–РЅРі',
	};

	openAddModal() {
		this.editingEvent.set(null);
		this.form = {
			title: '',
			description: '',
			date: '',
			time: '',
			location: '',
			type: 'РќРµС‚РІРѕСЂРєС–РЅРі',
		};
		this.isModalOpen.set(true);
	}

	openEditModal(event: Event) {
		this.editingEvent.set(event);
		this.form = {
			title: event.title,
			description: event.description,
			date: event.date,
			time: event.time,
			location: event.location,
			type: event.type,
		};
		this.isModalOpen.set(true);
	}

	closeModal() {
		this.isModalOpen.set(false);
		this.editingEvent.set(null);
	}

	save() {
		const editing = this.editingEvent();
		if (editing) {
			this.eventService
				.update({
					...editing,
					...this.form,
				})
				.subscribe();
		} else {
			this.eventService
				.add({
					...this.form,
					link: '',
				})
				.subscribe();
		}

		this.closeModal();
	}

	delete(id: string) {
		if (confirm('Р’Рё РІРїРµРІРЅРµРЅС–, С‰Рѕ С…РѕС‡РµС‚Рµ РІРёРґР°Р»РёС‚Рё С†СЋ РїРѕРґС–СЋ?')) {
			this.eventService.delete(id).subscribe();
		}
	}
}
