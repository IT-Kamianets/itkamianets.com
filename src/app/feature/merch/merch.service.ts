import { Injectable, computed } from '@angular/core';
import { CrudService } from 'wacom';
import { MerchProduct } from './merch.interface';

@Injectable({
	providedIn: 'root'
})
export class MerchService extends CrudService<MerchProduct> {
	products = computed(() => {
		return this.getSignals('', undefined)().map((sig) => {
			const doc = sig();
			return {
				...doc,
				name: doc.data?.name || '',
				price: doc.data?.price || 0,
				description: doc.data?.description || '',
				image: doc.data?.image || ''
			} as MerchProduct;
		});
	});

	constructor() {
		super({
			name: 'itproduct'
		});

		this.get().subscribe((items) => {
			if (items.length === 0) {
				this._seedDemoProducts();
			}
		});
	}

	private _seedDemoProducts() {
		const demoProducts = [
			{
				name: 'Чашка IT-Kamianets',
				price: 250,
				image: 'assets/Cup.png',
				description: 'Керамічна чашка 330 мл з логотипом IT-Kamianets.',
			},
			{
				name: 'Футболка IT-Kamianets',
				price: 550,
				image: 'assets/T-shirt.png',
				description: 'Бавовняна футболка чорного кольору.',
			},
		];

		demoProducts.forEach(product => {
			this.create({ data: product } as any).subscribe();
		});
	}
}
