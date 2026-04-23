import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Sale } from '../../sale.interface';
import { SaleService } from '../../sale.service';

@Component({
	standalone: true,
	templateUrl: './sales.component.html',
	styleUrl: './sales.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, RouterLink, TableModule, ButtonDirective],
})
export class SalesComponent {
	private readonly _saleService = inject(SaleService);

	protected readonly sales = signal<Sale[]>([]);
	protected readonly isLoading = signal(false);
	protected readonly apiError = signal('');

	constructor() {
		this._loadSales();
	}

	protected trackBySaleId(index: number, sale: Sale): string {
		return sale._id || String(index);
	}

	protected dataPreview(data: Record<string, unknown>): string {
		const raw = JSON.stringify(data ?? {});
		if (!raw) {
			return '{}';
		}

		return raw.length > 120 ? `${raw.slice(0, 117)}...` : raw;
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