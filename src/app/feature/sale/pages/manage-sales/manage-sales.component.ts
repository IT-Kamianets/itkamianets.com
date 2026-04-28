import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Sale, SaleData } from '../../sale.interface';
import { SaleService } from '../../sale.service';

interface SaleFormModel {
	name: string;
	description: string;
	data: string;
}

@Component({
	standalone: true,
	templateUrl: './manage-sales.component.html',
	styleUrl: './manage-sales.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule, RouterLink, TableModule, DialogModule, ButtonDirective],
})
export class ManageSalesComponent {
	private readonly _saleService = inject(SaleService);

	protected readonly sales = signal<Sale[]>([]);
	protected readonly isLoading = signal(false);
	protected readonly isSaving = signal(false);
	protected readonly isDialogOpen = signal(false);
	protected readonly editingId = signal<string | null>(null);
	protected readonly apiError = signal('');
	protected readonly jsonError = signal('');

	protected readonly form = signal<SaleFormModel>({
		name: '',
		description: '',
		data: '{\n  \n}',
	});

	constructor() {
		this._loadSales();
	}

	protected openCreate(): void {
		this.editingId.set(null);
		this.form.set({
			name: '',
			description: '',
			data: '{\n  \n}',
		});
		this.apiError.set('');
		this.jsonError.set('');
		this.isDialogOpen.set(true);
	}

	protected openEdit(sale: Sale): void {
		if (!sale._id) {
			return;
		}

		this.editingId.set(sale._id);
		this.form.set({
			name: sale.name || '',
			description: sale.description || '',
			data: this._stringifyData(sale.data),
		});
		this.apiError.set('');
		this.jsonError.set('');
		this.isDialogOpen.set(true);

		this._saleService.fetchOne(sale._id).subscribe({
			next: (fetched) => {
				if (!fetched) {
					return;
				}

				this.form.set({
					name: fetched.name || '',
					description: fetched.description || '',
					data: this._stringifyData(fetched.data),
				});
			},
		});
	}

	protected onDialogVisibleChange(visible: boolean): void {
		this.isDialogOpen.set(visible);
		if (!visible) {
			this.editingId.set(null);
			this.jsonError.set('');
		}
	}

	protected closeDialog(): void {
		this.isDialogOpen.set(false);
		this.editingId.set(null);
		this.jsonError.set('');
	}

	protected setName(name: string): void {
		this.form.update((value) => ({ ...value, name }));
	}

	protected setDescription(description: string): void {
		this.form.update((value) => ({ ...value, description }));
	}

	protected setData(data: string): void {
		this.form.update((value) => ({ ...value, data }));
	}

	protected save(): void {
		if (this.isSaving()) {
			return;
		}

		const current = this.form();
		const name = current.name.trim();
		if (!name) {
			this.apiError.set('Name is required.');
			return;
		}

		const parsedData = this._parseData(current.data);
		if (!parsedData) {
			return;
		}

		this.isSaving.set(true);
		this.apiError.set('');
		const payload = {
			name,
			description: current.description.trim(),
			data: parsedData,
		};

		const id = this.editingId();
		const request$ = id ? this._saleService.update(id, payload) : this._saleService.create(payload);

		request$.subscribe({
			next: (saved) => {
				if (!saved) {
					this.apiError.set('Failed to save sale.');
					this.isSaving.set(false);
					return;
				}

				this.closeDialog();
				this._loadSales();
				this.isSaving.set(false);
			},
			error: () => {
				this.apiError.set('Failed to save sale.');
				this.isSaving.set(false);
			},
		});
	}

	protected delete(sale: Sale): void {
		if (!sale._id) {
			return;
		}

		if (!confirm('Delete this sale?')) {
			return;
		}

		this.apiError.set('');
		this._saleService.delete(sale._id).subscribe({
			next: (deleted) => {
				if (!deleted) {
					this.apiError.set('Failed to delete sale.');
					return;
				}

				this._loadSales();
			},
			error: () => {
				this.apiError.set('Failed to delete sale.');
			},
		});
	}

	protected dataPreview(data: SaleData): string {
		const raw = JSON.stringify(data ?? {});
		if (!raw) {
			return '{}';
		}

		return raw.length > 140 ? `${raw.slice(0, 137)}...` : raw;
	}

	private _parseData(raw: string): SaleData | null {
		const trimmed = raw.trim();
		if (!trimmed) {
			this.jsonError.set('Data is required and must be a JSON object.');
			return null;
		}

		try {
			const parsed = JSON.parse(trimmed);
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				this.jsonError.set('Data must be a JSON object.');
				return null;
			}

			this.jsonError.set('');
			return parsed as SaleData;
		} catch {
			this.jsonError.set('Data must be valid JSON.');
			return null;
		}
	}

	private _stringifyData(data: SaleData): string {
		try {
			return JSON.stringify(data ?? {}, null, 2) || '{}';
		} catch {
			return '{}';
		}
	}

	private _loadSales(): void {
		this.isLoading.set(true);

		this._saleService.getAll().subscribe({
			next: (sales) => {
				this.sales.set(Array.isArray(sales) ? sales : []);
				this.apiError.set('');
				this.isLoading.set(false);
			},
			error: () => {
				this.sales.set([]);
				this.apiError.set('Failed to load sales.');
				this.isLoading.set(false);
			},
		});
	}
}