import { Injectable, computed } from '@angular/core';
import { CrudService } from 'wacom';
import { CertificateOption } from './certificate-option.interface';

@Injectable({
	providedIn: 'root',
})
export class CertificateOptionService extends CrudService<CertificateOption> {
	constructor() {
		super({
			name: 'itcertificateoption',
		});

		this.get().subscribe((items) => {
			if (items.length === 0) {
				this._seedDemoOptions();
			}
		});
	}

	private _seedDemoOptions() {
		const demoOptions = [
			{
				data: {
					title: 'Сертифікат про завершення курсу',
					description: 'За успішне проходження повного курсу та захист фінального проєкту. Підтверджує набуті знання та практичні навички.',
					templateStyle: 'classic',
				}
			},
			{
				data: {
					title: 'Диплом переможця хакатону',
					description: 'За зайняте призове місце в хакатоні та видатні досягнення в розробці інноваційного продукту.',
					templateStyle: 'modern',
				}
			},
			{
				data: {
					title: 'Подяка спікеру',
					description: 'За вагомий внесок у розвиток IT-спільноти, обмін досвідом та підготовку унікальної доповіді.',
					templateStyle: 'minimalist',
				}
			}
		];

		demoOptions.forEach(opt => {
			this.create(opt as any).subscribe();
		});
	}

	private _allSignals = this.getSignals('', undefined);

	readonly docs = computed(() => {
		return this._allSignals().map((sig) => sig());
	});
}
