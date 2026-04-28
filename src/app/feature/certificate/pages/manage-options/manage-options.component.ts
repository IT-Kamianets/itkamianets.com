import { ChangeDetectionStrategy, Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CertificateOptionService } from '../../certificate-option.service';
import { CertificateOption, CertificateOptionData } from '../../certificate-option.interface';

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
	protected form: CertificateOptionData = {
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
		const data = option.data;
		this.form = {
			title: data?.title || '',
			description: data?.description || '',
			templateStyle: data?.templateStyle || 'classic',
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
					alert('Р СџР С•Р СР С‘Р В»Р С”Р В°: РЎРѓР ВµРЎР‚Р Р†Р ВµРЎР‚ Р Р†РЎвЂ“Р Т‘РЎвЂ¦Р С‘Р В»Р С‘Р Р† Р С•Р Р…Р С•Р Р†Р В»Р ВµР Р…Р Р…РЎРЏ РЎв‚¬Р В°Р В±Р В»Р С•Р Р…РЎС“.');
				}
			});
		} else {
			this.optionService.create(option).subscribe((res) => {
				if (res) {
					this.editingOption.set(null);
					this.cdr.markForCheck();
				} else {
					alert('Р СџР С•Р СР С‘Р В»Р С”Р В°: РЎРѓР ВµРЎР‚Р Р†Р ВµРЎР‚ Р Р†РЎвЂ“Р Т‘РЎвЂ¦Р С‘Р В»Р С‘Р Р† РЎРѓРЎвЂљР Р†Р С•РЎР‚Р ВµР Р…Р Р…РЎРЏ РЎв‚¬Р В°Р В±Р В»Р С•Р Р…РЎС“.');
				}
			});
		}
	}

	protected delete(option: CertificateOption) {
		if (confirm('Р вЂ™Р С‘ Р Р†Р С—Р ВµР Р†Р Р…Р ВµР Р…РЎвЂ“, РЎвЂ°Р С• РЎвЂ¦Р С•РЎвЂЎР ВµРЎвЂљР Вµ Р Р†Р С‘Р Т‘Р В°Р В»Р С‘РЎвЂљР С‘ РЎвЂ Р ВµР в„– РЎв‚¬Р В°Р В±Р В»Р С•Р Р…?')) {
			this.optionService.delete(option).subscribe({
				next: (success) => {
					if (success) {
						this.cdr.markForCheck();
					} else {
						alert('Р СџР С•Р СР С‘Р В»Р С”Р В°: Р Р…Р Вµ Р Р†Р Т‘Р В°Р В»Р С•РЎРѓРЎРЏ Р Р†Р С‘Р Т‘Р В°Р В»Р С‘РЎвЂљР С‘ РЎв‚¬Р В°Р В±Р В»Р С•Р Р….');
					}
				},
				error: () => {
					alert('Р С™РЎР‚Р С‘РЎвЂљР С‘РЎвЂЎР Р…Р В° Р С—Р С•Р СР С‘Р В»Р С”Р В° Р С—РЎР‚Р С‘ Р Р†Р С‘Р Т‘Р В°Р В»Р ВµР Р…Р Р…РЎвЂ“ РЎв‚¬Р В°Р В±Р В»Р С•Р Р…РЎС“.');
				},
			});
		}
	}

	protected cancel() {
		this.editingOption.set(null);
	}
}
