import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MerchService } from '../../merch.service';
import { MerchProduct } from '../../merch.interface';

@Component({
	selector: 'app-manage-merch',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule
	],
	templateUrl: './manage-merch.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageMerchComponent {
	readonly ms = inject(MerchService);

	isFormVisible = signal(false);
	editingProduct = signal<MerchProduct | null>(null);

	newProduct = {
		name: '',
		price: 0,
		description: '',
		image: '',
	};

	showAddDialog() {
		this.editingProduct.set(null);
		this.newProduct = { name: '', price: 0, description: '', image: '' };
		this.isFormVisible.set(true);
	}

	startEdit(product: MerchProduct) {
		this.editingProduct.set(product);
		this.newProduct = {
			name: product.name || '',
			price: product.price || 0,
			description: product.description || '',
			image: product.image || '',
		};
		this.isFormVisible.set(true);
	}

	cancelEdit() {
		this.isFormVisible.set(false);
		this.editingProduct.set(null);
	}

	saveProduct() {
		if (this.newProduct.name && this.newProduct.price > 0) {
			const product = this.editingProduct();
			if (product) {
				// Оновлюємо існуючий продукт
				product.data = { ...this.newProduct };
				this.ms.update(product);
			} else {
				// Створюємо новий
				this.ms.create({ data: this.newProduct } as any);
			}
			this.cancelEdit();
		}
	}

	removeProduct(product: MerchProduct) {
		this.ms.delete(product);
	}

	onFileSelected(event: any) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e: any) => {
				this.newProduct.image = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
}
