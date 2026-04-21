import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { Item, ItemData } from '../../item.interface';
import { ItemService } from '../../item.service';

interface ItemFormModel {
	data: string;
}

@Component({
	templateUrl: './items-manage.component.html',
	styleUrl: './items-manage.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		TableModule,
		DialogModule,
		ButtonDirective,
		Textarea,
		FormField,
	],
})
export class ItemsManageComponent {
	private readonly _itemService = inject(ItemService);

	protected readonly items = signal<Item[]>([]);
	protected readonly isLoading = signal(false);
	protected readonly isSaving = signal(false);
	protected readonly isDialogOpen = signal(false);
	protected readonly editingId = signal<string | null>(null);
	protected readonly apiError = signal('');
	protected readonly jsonError = signal('');

	protected readonly model = signal<ItemFormModel>({
		data: '{\n  \n}',
	});

	protected readonly itemForm = form(this.model, (f) => {
		required(f.data, { message: 'Provide item data as JSON.' });
	});

	constructor() {
		this._loadItems();
	}

	protected openCreate(): void {
		this.editingId.set(null);
		this._setFormData({});
		this.apiError.set('');
		this.jsonError.set('');
		this.isDialogOpen.set(true);
	}

	protected openEdit(item: Item): void {
		if (!item._id) {
			return;
		}

		this.editingId.set(item._id);
		this._setFormData(item.data || {});
		this.apiError.set('');
		this.jsonError.set('');
		this.isDialogOpen.set(true);

		this._itemService.fetchOne(item._id).subscribe({
			next: (fetched) => {
				if (fetched) {
					this._setFormData(fetched.data || {});
				}
			},
		});
	}

	protected closeDialog(): void {
		this.isDialogOpen.set(false);
		this.editingId.set(null);
		this.jsonError.set('');
	}

	protected onDialogVisibleChange(visible: boolean): void {
		this.isDialogOpen.set(visible);
		if (!visible) {
			this.editingId.set(null);
			this.jsonError.set('');
		}
	}

	protected async onSubmit(event: Event): Promise<void> {
		event.preventDefault();
		if (this.isSaving()) {
			return;
		}

		await submit(this.itemForm, async (field) => {
			const raw = field().value().data;
			const parsed = this._parseData(raw);
			if (!parsed) {
				return;
			}

			this.isSaving.set(true);
			this.apiError.set('');

			const id = this.editingId();
			const request$ = id
				? this._itemService.update(id, parsed)
				: this._itemService.create(parsed);

			request$.subscribe({
				next: (saved) => {
					if (!saved) {
						this.apiError.set('Failed to save the item. Please try again.');
						this.isSaving.set(false);
						return;
					}

					this.closeDialog();
					this._loadItems();
					this.isSaving.set(false);
				},
				error: () => {
					this.apiError.set('Failed to save the item. Please try again.');
					this.isSaving.set(false);
				},
			});
		});
	}

	protected delete(item: Item): void {
		if (!item._id) {
			return;
		}

		if (!confirm('Delete this item?')) {
			return;
		}

		this.apiError.set('');

		this._itemService.delete(item._id).subscribe({
			next: (deleted) => {
				if (!deleted) {
					this.apiError.set('Failed to delete the item. Please try again.');
					return;
				}

				this._loadItems();
			},
			error: () => {
				this.apiError.set('Failed to delete the item. Please try again.');
			},
		});
	}

	protected trackByItemId(index: number, item: Item): string {
		return item._id || String(index);
	}

	protected dataPreview(data: ItemData): string {
		const raw = JSON.stringify(data ?? {});
		if (!raw) {
			return '{}';
		}

		return raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
	}

	private _setFormData(data: ItemData): void {
		this.model.set({
			data: this._stringifyData(data),
		});
	}

	private _stringifyData(data: ItemData): string {
		try {
			return JSON.stringify(data ?? {}, null, 2) || '{}';
		} catch {
			return '{}';
		}
	}

	private _parseData(raw: string): ItemData | null {
		const trimmed = raw.trim();
		if (!trimmed) {
			this.jsonError.set('Provide item data as JSON.');
			return null;
		}

		try {
			const parsed = JSON.parse(trimmed);
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				this.jsonError.set('Item data must be a JSON object.');
				return null;
			}

			this.jsonError.set('');
			return parsed as ItemData;
		} catch {
			this.jsonError.set('Item data must be valid JSON.');
			return null;
		}
	}

	private _loadItems(): void {
		this.isLoading.set(true);

		this._itemService.getAll().subscribe({
			next: (items) => {
				this.items.set(Array.isArray(items) ? items : []);
				this.apiError.set('');
				this.isLoading.set(false);
			},
			error: () => {
				this.items.set([]);
				this.apiError.set('Failed to load items.');
				this.isLoading.set(false);
			},
		});
	}
}
