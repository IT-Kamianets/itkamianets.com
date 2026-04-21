import { ChangeDetectionStrategy, Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CertificateOptionService } from '../../certificate-option.service';
import { CertificateOption } from '../../certificate-option.interface';

@Component({
	selector: 'app-manage-options',
	standalone: true,
	imports: [FormsModule, RouterLink],
	templateUrl: './manage-options.component.html',
	styleUrl: './manage-options.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageOptionsComponent {
	protected readonly optionService = inject(CertificateOptionService);
	protected readonly cdr = inject(ChangeDetectorRef);
	protected readonly options = this.optionService.docs;

	constructor() {
		this.optionService.getAll().subscribe();
	}

	protected readonly editingOption = signal<CertificateOption | null>(null);
	protected form = {
		title: '',
		description: '',
		templateStyle: 'classic',
	};

	protected create() {
		this.form = {
			title: '',
			description: '',
			templateStyle: 'classic',
		};
		this.editingOption.set(this.optionService.new() as CertificateOption);
	}

	protected edit(option: CertificateOption) {
		const data = option.data || {};
		this.form = {
			title: data['title'] || '',
			description: data['description'] || '',
			templateStyle: data['templateStyle'] || 'classic',
		};
		this.editingOption.set(option);
	}

	protected save() {
		const option = this.editingOption();
		if (!option) return;

		option.data = { ...this.form };

		if (option._id) {
			this.optionService.update(option).subscribe((res) => {
				if (res) {
					this.editingOption.set(null);
					this.cdr.markForCheck();
				} else {
					alert('РџРѕРјРёР»РєР°: СЃРµСЂРІРµСЂ РІС–РґС…РёР»РёРІ РѕРЅРѕРІР»РµРЅРЅСЏ С€Р°Р±Р»РѕРЅСѓ.');
				}
			});
		} else {
			this.optionService.create(option).subscribe((res) => {
				if (res) {
					this.editingOption.set(null);
					this.cdr.markForCheck();
				} else {
					alert('РџРѕРјРёР»РєР°: СЃРµСЂРІРµСЂ РІС–РґС…РёР»РёРІ СЃС‚РІРѕСЂРµРЅРЅСЏ С€Р°Р±Р»РѕРЅСѓ.');
				}
			});
		}
	}

	protected delete(option: CertificateOption) {
		if (confirm('Р’Рё РІРїРµРІРЅРµРЅС–, С‰Рѕ С…РѕС‡РµС‚Рµ РІРёРґР°Р»РёС‚Рё С†РµР№ С€Р°Р±Р»РѕРЅ?')) {
			this.optionService.delete(option).subscribe({
				next: (success) => {
					if (success) {
						this.cdr.markForCheck();
					} else {
						alert('РџРѕРјРёР»РєР°: РЅРµ РІРґР°Р»РѕСЃСЏ РІРёРґР°Р»РёС‚Рё С€Р°Р±Р»РѕРЅ.');
					}
				},
				error: () => {
					alert('РљСЂРёС‚РёС‡РЅР° РїРѕРјРёР»РєР° РїСЂРё РІРёРґР°Р»РµРЅРЅС– С€Р°Р±Р»РѕРЅСѓ.');
				},
			});
		}
	}

	protected cancel() {
		this.editingOption.set(null);
	}
}
