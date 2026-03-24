import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../event.service';
import { Event } from '../../event.interface';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-manage-events',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './manage-events.component.html',
	styleUrl: './manage-events.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEventsComponent {
	protected readonly eventService = inject(EventService);
	protected readonly events = toSignal(this.eventService.events, { initialValue: [] });
	
	protected isModalOpen = signal(false);
	protected editingEvent = signal<Event | null>(null);
	
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

	openEditModal(event: Event) {
		this.editingEvent.set(event);
		this.form = {
			title: event.data.title,
			description: event.data.description,
			date: event.data.date,
			time: event.data.time,
			location: event.data.location,
			type: event.data.type
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
				data: {
					...editing.data,
					...this.form
				}
			});
		} else {
			this.eventService.create({
				data: {
					...this.form,
					link: '#'
				}
			} as Event);
		}
		this.closeModal();
	}

	delete(event: Event) {
		if (confirm('Ви впевнені, що хочете видалити цю подію?')) {
			this.eventService.delete(event);
		}
	}
}
