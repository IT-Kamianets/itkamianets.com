import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { MerchProduct } from '../../merch.interface';
import { MerchService } from '../../merch.service';

@Component({
	selector: 'app-manage-merch',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		DialogModule,
		ButtonModule,
		InputTextModule,
		TextareaModule,
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
				Object.assign(product, this.newProduct);
				this.ms.update(product);
			} else {
				// Створюємо новий
				this.ms.create(this.newProduct);
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
