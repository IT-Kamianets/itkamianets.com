import {
	ChangeDetectionStrategy,
	Component,
	WritableSignal,
	computed,
	inject,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MerchService } from '../../merch.service';
import { MerchProduct } from '../../merch.interface';

interface MerchFormModel {
	image: FormControl<string>;
	name: FormControl<string>;
	price: FormControl<number>;
	description: FormControl<string>;
}

interface ToastItem {
	id: number;
	message: string;
}

@Component({
	selector: 'app-manage-merch',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TableModule,
		DialogModule,
		InputTextModule,
		ButtonModule,
	],
	templateUrl: './manage-merch.component.html',
	styleUrl: './manage-merch.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageMerchComponent {
	private readonly _merchService = inject(MerchService);
	private _toastId = 0;

	protected readonly products = signal<MerchProduct[]>([]);
	protected readonly isCreateDialogOpen = signal(false);
	protected readonly isEditOpen = signal(false);
	protected readonly isPreviewOpen = signal(false);
	protected readonly isPhotoPreviewOpen = signal(false);
	protected readonly deleteCandidate = signal<MerchProduct | null>(null);
	protected readonly editProductId = signal<string | null>(null);
	protected readonly createSubmitted = signal(false);
	protected readonly editSubmitted = signal(false);
	protected readonly previewProduct = signal<MerchProduct | null>(null);
	protected readonly createImageName = signal('Фото не вибрано');
	protected readonly editImageName = signal('Фото не вибрано');
	protected readonly apiError = signal('');
	protected readonly toasts = signal<ToastItem[]>([]);

	protected readonly createForm = this._createForm();
	protected readonly editForm = this._createForm();

	protected readonly previewImageSrc = computed(() => {
		const product = this.previewProduct();
		return product?.image || '';
	});

	constructor() {
		this._merchService.seedDemoIfEmpty();
		this._loadProducts();
	}

	protected openCreateDialog(): void {
		this.clearCreateForm();
		this.apiError.set('');
		this.isCreateDialogOpen.set(true);
	}

	protected closeCreateDialog(): void {
		this.isCreateDialogOpen.set(false);
	}

	protected onCreateDialogVisibleChange(visible: boolean): void {
		this.isCreateDialogOpen.set(visible);
	}

	protected onCreateImageChange(event: Event): void {
		this._readImage(event, this.createForm.controls.image, this.createImageName);
	}

	protected onEditImageChange(event: Event): void {
		this._readImage(event, this.editForm.controls.image, this.editImageName);
	}

	protected clearCreateForm(): void {
		this.createForm.reset({
			image: '',
			name: '',
			price: 0,
			description: '',
		});
		this.createImageName.set('Фото не вибрано');
		this.createSubmitted.set(false);
	}

	protected openDraftPreview(): void {
		this.createSubmitted.set(true);
		if (this.createForm.invalid) {
			this.createForm.markAllAsTouched();
			return;
		}

		const data = this.createForm.getRawValue();
		this.previewProduct.set({ _id: 'preview', ...data } as MerchProduct);
		this.isPreviewOpen.set(true);
	}

	protected openEditDraftPreview(): void {
		this.editSubmitted.set(true);
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		const data = this.editForm.getRawValue();
		this.previewProduct.set({ _id: 'preview', ...data } as MerchProduct);
		this.isPreviewOpen.set(true);
	}

	protected publishProduct(): void {
		this.createSubmitted.set(true);
		this.apiError.set('');
		if (this.createForm.invalid) {
			this.createForm.markAllAsTouched();
			return;
		}

		const data = this.createForm.getRawValue();
		this._merchService.create({ data } as any).subscribe({
			next: (created) => {
				if (!created) {
					this.apiError.set('Не вдалося зберегти товар. Спробуйте пізніше.');
					return;
				}

				this._loadProducts();
				this.closeCreateDialog();
				this.clearCreateForm();
				this._showToast('Товар успішно додано!');
			},
			error: () => {
				this.apiError.set('Не вдалося зберегти товар. Спробуйте пізніше.');
			},
		});
	}

	protected openProductPreview(product: MerchProduct): void {
		this.previewProduct.set(product);
		this.isPreviewOpen.set(true);
	}

	protected closePreview(): void {
		this.isPreviewOpen.set(false);
		this.previewProduct.set(null);
	}

	protected openPhotoPreview(product: MerchProduct): void {
		this.previewProduct.set(product);
		this.isPhotoPreviewOpen.set(true);
	}

	protected closePhotoPreview(): void {
		this.isPhotoPreviewOpen.set(false);
	}

	protected openEdit(product: MerchProduct): void {
		this.editProductId.set(product._id || null);
		this.editForm.reset({
			image: product.image || '',
			name: product.name || '',
			price: product.price || 0,
			description: product.description || '',
		});
		this.editImageName.set(product.image ? 'Зображення вибрано' : 'Фото не вибрано');
		this.editSubmitted.set(false);
		this.isEditOpen.set(true);
	}

	protected closeEdit(): void {
		this.isEditOpen.set(false);
		this.editProductId.set(null);
		this.editSubmitted.set(false);
	}

	protected onEditDialogVisibleChange(visible: boolean): void {
		this.isEditOpen.set(visible);
		if (!visible) {
			this.editProductId.set(null);
			this.editSubmitted.set(false);
		}
	}

	protected saveEdit(): void {
		this.editSubmitted.set(true);
		this.apiError.set('');
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		const id = this.editProductId();
		if (!id) return;

		const data = this.editForm.getRawValue();
		this._merchService.update({ _id: id, data } as any).subscribe({
			next: (updated) => {
				if (!updated) {
					this.apiError.set('Не вдалося оновити товар. Спробуйте пізніше.');
					return;
				}

				this._loadProducts();
				this.closeEdit();
				this._showToast('Дані товару успішно оновлено!');
			},
			error: () => {
				this.apiError.set('Не вдалося оновити товар. Спробуйте пізніше.');
			},
		});
	}

	protected askDelete(product: MerchProduct): void {
		this.deleteCandidate.set(product);
	}

	protected cancelDelete(): void {
		this.deleteCandidate.set(null);
	}

	protected confirmDelete(): void {
		const candidate = this.deleteCandidate();
		if (!candidate?._id) return;

		this.apiError.set('');
		this._merchService.delete(candidate._id).subscribe({
			next: (deleted) => {
				if (!deleted) {
					this.apiError.set('Не вдалося видалити товар. Спробуйте пізніше.');
					return;
				}
				this._loadProducts();
				this.deleteCandidate.set(null);
				this._showToast('Товар успішно видалено!');
			},
			error: () => {
				this.apiError.set('Не вдалося видалити товар. Спробуйте пізніше.');
			},
		});
	}

	private _loadProducts(): void {
		this._merchService.getAll().subscribe({
			next: (products) => {
				this.products.set(Array.isArray(products) ? products : []);
				this.apiError.set('');
			},
			error: () => {
				this.products.set([]);
				this.apiError.set('Не вдалося завантажити список товарів.');
			},
		});
	}

	private _createForm(): FormGroup<MerchFormModel> {
		return new FormGroup<MerchFormModel>({
			image: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required],
			}),
			name: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(2)],
			}),
			price: new FormControl(0, {
				nonNullable: true,
				validators: [Validators.required, Validators.min(1)],
			}),
			description: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(10)],
			}),
		});
	}

	private _readImage(
		event: Event,
		control: FormControl<string>,
		nameSignal: WritableSignal<string>,
	): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		nameSignal.set(file.name);
		this._readAsDataUrl(file)
			.then((rawDataUrl) => this._compressImageDataUrl(rawDataUrl, file.type))
			.catch(() => this._readAsDataUrl(file))
			.then((result) => {
				if (this._dataUrlByteSize(result) > 500_000) {
					this.apiError.set('Зображення занадто велике. Оберіть менше або стисніть файл.');
					return;
				}

				control.setValue(result);
				control.markAsDirty();
				control.markAsTouched();
				control.updateValueAndValidity();
				this.apiError.set('');
			});
	}

	private _readAsDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(file);
		});
	}

	private _compressImageDataUrl(dataUrl: string, fileType: string): Promise<string> {
		if (!dataUrl.startsWith('data:image/')) return Promise.resolve(dataUrl);
		if (fileType === 'image/gif' || fileType === 'image/svg+xml') return Promise.resolve(dataUrl);

		return new Promise((resolve) => {
			const image = new Image();
			image.onload = () => {
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				if (!context) {
					resolve(dataUrl);
					return;
				}

				const targetType = fileType === 'image/webp' ? 'image/webp' : 'image/jpeg';
				const targetBytes = 250_000;
				let maxSide = 1200;
				let quality = 0.8;
				let output = dataUrl;

				for (let attempt = 0; attempt < 5; attempt++) {
					const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
					canvas.width = Math.round(image.width * scale);
					canvas.height = Math.round(image.height * scale);
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(image, 0, 0, canvas.width, canvas.height);

					output = canvas.toDataURL(targetType, quality);
					if (this._dataUrlByteSize(output) <= targetBytes) break;
					quality -= 0.1;
					maxSide -= 100;
				}
				resolve(output);
			};
			image.onerror = () => resolve(dataUrl);
			image.src = dataUrl;
		});
	}

	private _dataUrlByteSize(dataUrl: string): number {
		const base64 = dataUrl.split(',')[1] || '';
		const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
		return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
	}

	private _showToast(message: string): void {
		const id = ++this._toastId;
		this.toasts.update((current) => [...current, { id, message }]);
		setTimeout(() => {
			this.toasts.update((current) => current.filter((t) => t.id !== id));
		}, 2000);
	}
}
