import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';

interface MerchItem {
	id: number;
	name: string;
	price: number;
	image: string;
	description: string;
}

@Component({
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		DialogModule,
		ButtonModule,
		InputTextModule,
		TextareaModule
	],
	templateUrl: './merch.component.html',
	styleUrl: './merch.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchComponent {
	readonly products = signal<MerchItem[]>([
		{
			id: 1,
			name: 'Чашка IT-Kamianets',
			price: 250,
			image: 'assets/Cup.png',
			description: 'Керамічна чашка 330 мл з логотипом IT-Kamianets.',
		},
		{
			id: 2,
			name: 'Футболка IT-Kamianets',
			price: 550,
			image: 'assets/T-shirt.png',
			description: 'Бавовняна футболка чорного кольору.',
		},
	]);

	isFormVisible = signal(false);
	editingId = signal<number | null>(null);

	newItem = {
		name: '',
		price: 0,
		description: '',
		image: '',
	};

	showAddDialog() {
		this.cancelEdit();
		this.isFormVisible.set(true);
	}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				this.newItem.image = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	startEdit(item: MerchItem) {
		this.editingId.set(item.id);
		this.newItem = {
			name: item.name,
			price: item.price,
			description: item.description,
			image: item.image,
		};
		this.isFormVisible.set(true);
	}

	cancelEdit() {
		this.editingId.set(null);
		this.isFormVisible.set(false);
		this.newItem = {
			name: '',
			price: 0,
			description: '',
			image: '',
		};
	}

	saveItem() {
		if (this.newItem.name && this.newItem.price > 0) {
			const id = this.editingId();
			if (id !== null) {
				this.products.update((items) =>
					items.map((item) =>
						item.id === id ? { ...this.newItem, id } : item
					)
				);
			} else {
				this.products.update((items) => [
					...items,
					{
						...this.newItem,
						id: Date.now(),
						image: this.newItem.image || 'assets/logo.png',
					},
				]);
			}
			this.cancelEdit();
		}
	}

	removeItem(id: number) {
		if (this.editingId() === id) {
			this.cancelEdit();
		}
		this.products.update((items) => items.filter((item) => item.id !== id));
	}
}
