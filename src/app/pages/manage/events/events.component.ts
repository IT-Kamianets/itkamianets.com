import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../feature/event/event.service';
import { EventCard } from '../../../data/events.data';

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
	protected editingEvent = signal<EventCard | null>(null);
	
	protected form = {
		title: '',
		description: '',
		date: '',
		time: '',
		location: '',
		type: 'Нетворкінг'
	};

	openAddModal() {
		this.editingEvent.set(null);
		this.form = {
			title: '',
			description: '',
			date: '',
			time: '',
			location: '',
			type: 'Нетворкінг'
		};
		this.isModalOpen.set(true);
	}

	openEditModal(event: EventCard) {
		this.editingEvent.set(event);
		this.form = {
			title: event.title,
			description: event.description,
			date: event.date,
			time: event.time,
			location: event.location,
			type: event.type
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
			this.eventService.update({
				...editing,
				...this.form
			});
		} else {
			this.eventService.add({
				...this.form,
				link: '#'
			});
		}
		this.closeModal();
	}

	delete(id: number) {
		if (confirm('Ви впевнені, що хочете видалити цю подію?')) {
			this.eventService.delete(id);
		}
	}
}
