import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { Item, ItemData } from '../../item.interface';
import { ItemService } from '../../item.service';

@Component({
	selector: 'app-manage-items',
	standalone: true,
	imports: [FormsModule, ButtonDirective, DialogModule, TableModule, Textarea],
	templateUrl: './manage-items.component.html',
	styleUrl: './manage-items.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageItemsComponent {
	private readonly itemService = inject(ItemService);

	protected readonly items = signal<Item[]>([]);
	protected readonly isLoading = signal(false);
	protected readonly isSaving = signal(false);
	protected readonly deletingId = signal<string | null>(null);
	protected readonly loadError = signal('');
	protected readonly formError = signal('');
	protected readonly feedbackTone = signal<'success' | 'error' | 'info'>('info');
	protected readonly feedbackMessage = signal('');

	protected readonly dialogVisible = signal(false);
	protected readonly editingItem = signal<Item | null>(null);
	protected readonly dataText = signal('{}');

	constructor() {
		this.loadItems();
	}

	protected loadItems(): void {
		if (this.isLoading()) {
			return;
		}

		this.isLoading.set(true);
		this.loadError.set('');

		this.itemService
			.get()
			.pipe(finalize(() => this.isLoading.set(false)))
			.subscribe({
				next: (items) => {
					this.items.set(Array.isArray(items) ? items : []);
				},
				error: () => {
					this.loadError.set('Failed to load items.');
				},
			});
	}

	protected openCreate(): void {
		this.editingItem.set(null);
		this.formError.set('');
		this.dataText.set('{}');
		this.dialogVisible.set(true);
	}

	protected openEdit(item: Item): void {
		this.editingItem.set(item);
		this.formError.set('');
		this.dataText.set(this.stringifyData(item.data));
		this.dialogVisible.set(true);
	}

	protected closeDialog(): void {
		this.dialogVisible.set(false);
		this.editingItem.set(null);
		this.formError.set('');
	}

	protected save(): void {
		if (this.isSaving()) {
			return;
		}

		this.formError.set('');
		const parsed = this.parseData(this.dataText());
		if (!parsed) {
			this.formError.set('Invalid JSON. Provide a valid object for data.');
			return;
		}

		this.isSaving.set(true);
		const editing = this.editingItem();
		const request$ = editing
			? this.itemService.update({ _id: editing._id, data: parsed })
			: this.itemService.create({ data: parsed });

		request$
			.pipe(finalize(() => this.isSaving.set(false)))
			.subscribe({
				next: () => {
					this.feedbackTone.set('success');
					this.feedbackMessage.set(
						editing ? 'Item updated successfully.' : 'Item created successfully.',
					);
					this.closeDialog();
					this.loadItems();
				},
				error: () => {
					this.formError.set('Failed to save item.');
				},
			});
	}

	protected delete(item: Item): void {
		if (this.deletingId()) {
			return;
		}

		if (!confirm('Delete this item?')) {
			return;
		}

		this.deletingId.set(item._id);
		this.itemService
			.delete({ _id: item._id })
			.pipe(finalize(() => this.deletingId.set(null)))
			.subscribe({
				next: () => {
					this.feedbackTone.set('success');
					this.feedbackMessage.set('Item deleted.');
					this.loadItems();
				},
				error: () => {
					this.feedbackTone.set('error');
					this.feedbackMessage.set('Failed to delete item.');
				},
			});
	}

	protected getLabel(item: Item): string {
		const data = this.asRecord(item.data);
		return (
			this.pickString(data, ['title', 'name', 'label', 'headline']) ||
			this.pickString(data, ['slug', 'key']) ||
			'—'
		);
	}

	protected getType(item: Item): string {
		const data = this.asRecord(item.data);
		return this.pickString(data, ['type', 'kind', 'category']) || '—';
	}

	protected getDataSummary(item: Item): string {
		const data = this.asRecord(item.data);
		const json = JSON.stringify(data);
		if (!json) {
			return '—';
		}

		return json.length > 120 ? `${json.slice(0, 117)}...` : json;
	}

	protected onDialogHide(): void {
		this.closeDialog();
	}

	private parseData(text: string): ItemData | null {
		const source = text?.trim().length ? text : '{}';
		try {
			const parsed = JSON.parse(source);
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				return null;
			}
			return parsed as ItemData;
		} catch {
			return null;
		}
	}

	private stringifyData(data: ItemData | undefined): string {
		try {
			return JSON.stringify(data ?? {}, null, 2);
		} catch {
			return '{}';
		}
	}

	private asRecord(data: ItemData | unknown): Record<string, unknown> {
		if (!data || typeof data !== 'object' || Array.isArray(data)) {
			return {};
		}

		return data as Record<string, unknown>;
	}

	private pickString(
		source: Record<string, unknown>,
		keys: string[],
	): string | null {
		for (const key of keys) {
			const value = source[key];
			if (typeof value === 'string' && value.trim().length) {
				return value.trim();
			}
		}

		return null;
	}
}
