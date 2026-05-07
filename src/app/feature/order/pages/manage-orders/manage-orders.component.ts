import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../order.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
	selector: 'app-manage-orders',
	standalone: true,
	imports: [CommonModule, TableModule, TagModule, ButtonModule, SelectButtonModule, FormsModule, DialogModule],
	templateUrl: './manage-orders.component.html',
	styles: [`
		.status-select {
			background-color: var(--c-bg-secondary);
			color: var(--c-text-primary);
			border: 1px solid var(--c-border);
			border-radius: var(--radius);
			padding: var(--sp-1);
			font-size: 0.75rem;
			outline: none;
			cursor: pointer;
			transition: border-color var(--motion);
		}
		.status-select:hover {
			border-color: var(--c-primary);
		}
		.status-select option {
			background-color: var(--c-bg-secondary);
			color: var(--c-text-primary);
		}
		:host ::ng-deep .p-tag {
			font-size: 0.7rem;
			font-weight: 700;
			text-transform: uppercase;
		}
		/* Ensure dialog content sections have correct background in dark mode */
		.details-section {
			background-color: var(--c-bg-tertiary);
			padding: var(--sp-4);
			border-radius: var(--radius-card);
		}
	`],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageOrdersComponent {
	protected readonly os = inject(OrderService);
	
	protected selectedOrder = signal<any | null>(null);
	protected isDetailsVisible = signal(false);
	protected apiError = signal<string | null>(null);

	protected statusOptions = [
		{ label: 'Новий', value: 'pending' },
		{ label: 'Відправлено', value: 'shipped' },
		{ label: 'Доставлено', value: 'delivered' },
		{ label: 'Скасовано', value: 'cancelled' }
	];

	constructor() {
		this.load();
	}

	load() {
		this.os.getAll().subscribe();
	}

	updateStatus(order: any, newStatus: string) {
		const updatedOrder = { ...order, status: newStatus };
		this.os.update(updatedOrder).subscribe();
	}

	showDetails(order: any) {
		this.selectedOrder.set(order);
		this.isDetailsVisible.set(true);
	}

	getSeverity(status: string) {
		switch (status) {
			case 'pending': return 'warn';
			case 'shipped': return 'info';
			case 'delivered': return 'success';
			case 'cancelled': return 'danger';
			default: return 'info';
		}
	}

	deleteOrder(id: string) {
		if (confirm('Ви впевнені, що хочете видалити це замовлення?')) {
			this.os.delete(id).subscribe(() => this.load());
		}
	}
}
