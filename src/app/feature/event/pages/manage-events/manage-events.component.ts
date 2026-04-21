import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../event.service';
import { Event } from '../../event.interface';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-manage-events',
	standalone: true,
	imports: [FormsModule, CommonModule, RouterLink],
	templateUrl: './manage-events.component.html',
	styleUrl: './manage-events.component.scss',
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
		type: 'Нетворкінг',
		price: 0,
		maxSeats: 0,
	};

	openAddModal() {
		this.editingEvent.set(null);
        
        const now = new Date();
        const defaultDate = now.toLocaleDateString('uk-UA', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });

		this.form = {
			title: '',
			description: '',
			date: defaultDate,
			time: '18:00',
			location: '',
			type: 'Нетворкінг',
			price: 0,
			maxSeats: 0,
		};
		this.isModalOpen.set(true);
	}

	openEditModal(event: Event) {
		this.editingEvent.set(event);
		const data = event.data || {};
		this.form = {
			title: data.title || event.name || '',
			description: data.description || event.description || '',
			date: data.date || '',
			time: data.time || '',
			location: data.location || '',
			type: data.type || 'Нетворкінг',
			price: typeof data.price !== 'undefined' ? data.price : 0,
			maxSeats: typeof data.maxSeats !== 'undefined' ? data.maxSeats : 0,
		};
		this.isModalOpen.set(true);
	}

	closeModal() {
		this.isModalOpen.set(false);
		this.editingEvent.set(null);
	}

	save() {
		const editing = this.editingEvent();
		const date = this._normalizeDate(this.form.date);

		const payload: any = {
			name: this.form.title,
			title: this.form.title,
			description: this.form.description,
			date: date,
			time: this.form.time,
			location: this.form.location,
			type: this.form.type,
			price: this.form.price,
			maxSeats: this.form.maxSeats,
			data: {
				...this.form,
				date: date,
				link: '#',
			},
		};

		if (editing && editing._id && editing._id.length > 5) {
			payload._id = editing._id;
			this.eventService.update(payload).subscribe(() => {
				this.eventService.refresh();
				this.closeModal();
			});
		} else {
			this.eventService.create(payload).subscribe(() => {
				this.eventService.refresh();
				this.closeModal();
			});
		}
	}

	private _normalizeDate(date: string): string {
		if (!date) return '';
		const numericMatch = date.trim().match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{2,4}))?$/);
		if (numericMatch) {
			const day = parseInt(numericMatch[1]);
			const month = parseInt(numericMatch[2]);
			let year = new Date().getFullYear();
			if (numericMatch[3]) {
				year = numericMatch[3].length === 2 ? 2000 + parseInt(numericMatch[3]) : parseInt(numericMatch[3]);
			}
			const months = ['Січня', 'Лютого', 'Березня', 'Квітня', 'Травня', 'Червня', 'Липня', 'Серпня', 'Вересня', 'Жовтня', 'Листопада', 'Грудня'];
			if (month >= 1 && month <= 12) return `${day} ${months[month - 1]}, ${year}`;
		}
		return date;
	}

	delete(event: Event) {
		if (confirm('Ви впевнені, що хочете видалити цю подію?')) {
			this.eventService.delete(event).subscribe(() => this.eventService.refresh());
		}
	}
}
