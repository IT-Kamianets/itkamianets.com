import { isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	PLATFORM_ID,
	computed,
	effect,
	inject,
	signal,
} from '@angular/core';

interface MerchItem {
	id: number;
	name: string;
	price: number;
	image: string;
	description: string;
}

interface CartItem {
	product: MerchItem;
	quantity: number;
}

@Component({
	selector: 'app-merch',
	templateUrl: './merch.component.html',
	styleUrl: './merch.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchComponent {
	private platformId = inject(PLATFORM_ID);
	private isBrowser = isPlatformBrowser(this.platformId);

	constructor() {
		effect(() => {
			if (!this.isBrowser) return;
			if (this.showCart()) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		});
	}

	readonly products: MerchItem[] = [
		{
			id: 1,
			name: 'Чашка IT-Kamianets',
			price: 250,
			image: 'Cup',
			description:
				'Керамічна чашка 330 мл з логотипом IT-Kamianets. Ідеальна для ранкової кави під час кодингу.',
		},
		{
			id: 2,
			name: 'Футболка IT-Kamianets',
			price: 550,
			image: 'T-shirt',
			description:
				'Бавовняна футболка чорного кольору з мінімалістичним принтом IT-Kamianets на грудях.',
		},
		{
			id: 3,
			name: 'Стікер IT-Kamianets для ноутбука',
			price: 50,
			image: 'Sticker',
			description:
				'Вінілова наклейка з логотипом IT-Kamianets. Водостійка, підходить для ноутбуків, телефонів та пляшок.',
		},
		{
			id: 4,
			name: 'Худі IT-Kamianets',
			price: 950,
			image: 'Skinny',
			description:
				'Тепле худі з капюшоном та вишитим логотипом IT-Kamianets. Ідеальне для холодних вечорів з кодом.',
		},
		{
			id: 5,
			name: 'Кепка IT-Kamianets',
			price: 350,
			image: 'Cap',
			description:
				'Стильна кепка з вишитим логотипом IT-Kamianets. Регульований розмір та 100% бавовна.',
		},
		{
			id: 6,
			name: 'Шкарпетки IT-Kamianets',
			price: 150,
			image: 'Socks',
			description:
				'Комплект з 3 пар шкарпеток з IT-принтами. Ідеальне для холодних вечорів з кодом. Розмір 39–45.',
		},
	];

	cart = signal<CartItem[]>([]);
	showCart = signal(false);
	toasts = signal<{ id: number; message: string }[]>([]);
	showShippingForm = signal(false);

	private toastIdCounter = 0;

	private addToast(message: string, duration: number): void {
		const id = ++this.toastIdCounter;
		this.toasts.update((current) => [...current, { id, message }]);
		setTimeout(() => {
			this.toasts.update((current) => current.filter((t) => t.id !== id));
		}, duration);
	}

	// Shipping form fields
	shippingFirstName = '';
	shippingLastName = '';
	shippingCarrier: 'nova-poshta' | 'ukrposhta' = 'nova-poshta';
	shippingCity = '';
	shippingPostOffice = '';

	// Touched state for validation
	touched: Record<string, boolean> = {};

	markTouched(field: string): void {
		this.touched[field] = true;
	}

	get firstNameError(): string {
		if (!this.touched['firstName']) return '';
		const v = this.shippingFirstName.trim();
		if (!v) return "Обов'язкове поле";
		if (v.length < 3) return 'Мінімум 3 символи';
		if (/\d/.test(v)) return 'Не може містити цифри';
		return '';
	}

	get lastNameError(): string {
		if (!this.touched['lastName']) return '';
		const v = this.shippingLastName.trim();
		if (!v) return "Обов'язкове поле";
		if (v.length < 3) return 'Мінімум 3 символи';
		if (/\d/.test(v)) return 'Не може містити цифри';
		return '';
	}

	get cityError(): string {
		if (!this.touched['city']) return '';
		const v = this.shippingCity.trim();
		if (!v) return "Обов'язкове поле";
		if (v.length < 3) return 'Мінімум 3 символи';
		if (/\d/.test(v)) return 'Не може містити цифри';
		return '';
	}

	get postOfficeError(): string {
		if (!this.touched['postOffice']) return '';
		const v = this.shippingPostOffice.trim();
		if (!v) return "Обов'язкове поле";
		return '';
	}

	cartCount = computed(() => this.cart().reduce((sum, item) => sum + item.quantity, 0));
	cartTotal = computed(() =>
		this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
	);

	addToCart(product: MerchItem): void {
		this.cart.update((items) => {
			const existing = items.find((i) => i.product.id === product.id);
			if (existing) {
				return items.map((i) =>
					i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
				);
			}
			return [...items, { product, quantity: 1 }];
		});
		this.addToast('Товар додано у кошик', 2000);
	}

	removeFromCart(productId: number): void {
		this.cart.update((items) => items.filter((i) => i.product.id !== productId));
	}

	updateQuantity(productId: number, delta: number): void {
		this.cart.update((items) =>
			items
				.map((i) =>
					i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i,
				)
				.filter((i) => i.quantity > 0),
		);
	}

	toggleCart(): void {
		this.showCart.update((v) => !v);
		if (!this.showCart()) {
			this.showShippingForm.set(false);
		}
	}

	proceedToShipping(): void {
		if (this.cart().length === 0) return;
		this.showShippingForm.set(true);
	}

	get isShippingValid(): boolean {
		const fn = this.shippingFirstName.trim();
		const ln = this.shippingLastName.trim();
		const city = this.shippingCity.trim();
		const po = this.shippingPostOffice.trim();
		return (
			fn.length >= 3 &&
			!/\d/.test(fn) &&
			ln.length >= 3 &&
			!/\d/.test(ln) &&
			city.length >= 3 &&
			!/\d/.test(city) &&
			po.length > 0
		);
	}

	checkout(): void {
		// Touch all fields to show errors
		this.touched = { firstName: true, lastName: true, city: true, postOffice: true };
		if (!this.isShippingValid) return;
		this.cart.set([]);
		this.showCart.set(false);
		this.showShippingForm.set(false);
		if (this.isBrowser) {
			document.body.style.overflow = '';
		}
		this.shippingFirstName = '';
		this.shippingLastName = '';
		this.shippingCity = '';
		this.shippingPostOffice = '';
		this.touched = {};
		this.addToast('Замовлення оформлено. Дякуємо за покупку!', 3000);
	}
}
