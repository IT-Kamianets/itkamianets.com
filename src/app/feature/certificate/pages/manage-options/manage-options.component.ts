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

	protected seed() {
		this.optionService.seedDemoOptions();
	}

	protected readonly editingOption = signal<CertificateOption | null>(null);
	protected form = {
		title: '',
		description: '',
		templateStyle: 'classic'
	};

	protected create() {
		this.form = {
			title: '',
			description: '',
			templateStyle: 'classic'
		};
		this.editingOption.set(this.optionService.new() as CertificateOption);
	}

	protected edit(option: CertificateOption) {
		const data = option.data || {};
		this.form = {
			title: data['title'] || '',
			description: data['description'] || '',
			templateStyle: data['templateStyle'] || 'classic'
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
					alert('Помилка: сервер відхилив оновлення шаблону.');
				}
			});
		} else {
			this.optionService.create(option).subscribe((res) => {
				if (res) {
					this.editingOption.set(null);
					this.cdr.markForCheck();
				} else {
					alert('Помилка: сервер відхилив створення шаблону.');
				}
			});
		}
	}

	protected delete(option: CertificateOption) {
		if (confirm('Ви впевнені, що хочете видалити цей шаблон?')) {
			this.optionService.delete(option).subscribe({
				next: (success) => {
					if (success) {
						this.cdr.markForCheck();
					} else {
						alert('Помилка: не вдалося видалити шаблон.');
					}
				},
				error: () => {
					alert('Критична помилка при видаленні шаблону.');
				}
			});
		}
	}

	protected cancel() {
		this.editingOption.set(null);
	}
}
