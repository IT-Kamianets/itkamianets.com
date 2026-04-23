import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Sale } from '../../sale.interface';
import { SaleService } from '../../sale.service';

@Component({
	standalone: true,
	templateUrl: './sale.component.html',
	styleUrl: './sale.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, RouterLink, JsonPipe],
})
export class SaleComponent {
	private readonly _route = inject(ActivatedRoute);
	private readonly _saleService = inject(SaleService);

	private readonly _idParams = toSignal(this._route.queryParamMap);
	protected readonly sale = signal<Sale | null>(null);
	protected readonly isLoading = signal(false);
	protected readonly apiError = signal('');

	constructor() {
		toObservable(this._idParams)
			.pipe(
				tap(() => {
					this.isLoading.set(true);
					this.apiError.set('');
				}),
				switchMap((params) => {
					const id = params?.get('id');
					if (!id) {
						return [null];
					}

					return this._saleService.fetchOne(id);
				}),
				tap((sale) => {
					this.sale.set(sale);
					if (!sale) {
						this.apiError.set('Sale not found.');
					}
					this.isLoading.set(false);
				}),
			)
			.subscribe();
	}
}
