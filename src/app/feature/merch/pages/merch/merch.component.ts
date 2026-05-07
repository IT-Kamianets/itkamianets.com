import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchService } from '../../merch.service';
import { OrderService } from '../../../order/order.service';
import { MerchProduct } from '../../merch.interface';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer';

interface CartItem extends MerchProduct {
	quantity: number;
}

@Component({
	selector: 'app-merch',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		BadgeModule,
		DrawerModule
	],
	templateUrl: './merch.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchComponent {
	readonly ms = inject(MerchService);
	readonly os = inject(OrderService);

	cart = signal<CartItem[]>([]);
	isCartVisible = signal(false);

	customer = {
		name: '',
		email: '',
		phone: '',
		address: ''
	};

	total = computed(() => {
		return this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0);
	});

	addToCart(product: MerchProduct) {
		this.cart.update(items => {
			const existing = items.find(i => i._id === product._id);
			if (existing) {
				return items.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
			}
			return [...items, { ...product, quantity: 1 }];
		});
		this.isCartVisible.set(true);
	}

	removeFromCart(productId: string) {
		this.cart.update(items => items.filter(i => i._id !== productId));
	}

	updateQuantity(productId: string, delta: number) {
		this.cart.update(items => items.map(i => {
			if (i._id === productId) {
				const newQty = Math.max(1, i.quantity + delta);
				return { ...i, quantity: newQty };
			}
			return i;
		}));
	}

	placeOrder() {
		if (!this.customer.name || !this.customer.phone || this.cart().length === 0) return;

		const orderData = {
			items: this.cart().map(i => ({
				productId: i._id,
				name: i.name,
				price: i.price,
				quantity: i.quantity
			})),
			total: this.total(),
			customer: { ...this.customer },
			status: 'pending',
			date: new Date()
		};

		this.os.create({
			data: orderData
		}).subscribe({
			next: (res) => {
				if (res) {
					this.cart.set([]);
					this.isCartVisible.set(false);
					alert('Замовлення успішно оформлено!');
				}
			}
		});
	}
}
