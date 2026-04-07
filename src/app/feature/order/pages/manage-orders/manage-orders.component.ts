import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../order.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-manage-orders',
	standalone: true,
	imports: [CommonModule, TableModule, TagModule, ButtonModule],
	templateUrl: './manage-orders.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageOrdersComponent {
	readonly os = inject(OrderService);

	getSeverity(status: string) {
		switch (status) {
			case 'pending': return 'warn';
			case 'shipped': return 'info';
			case 'delivered': return 'success';
			case 'cancelled': return 'danger';
			default: return 'info';
		}
	}

	deleteOrder(order: any) {
		if (confirm('Ви впевнені, що хочете видалити це замовлення?')) {
			this.os.delete(order);
		}
	}
}
