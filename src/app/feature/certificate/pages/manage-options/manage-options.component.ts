import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
	protected readonly options = this.optionService.docs;

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
		this.editingOption.set({ ...option });
	}

	protected save() {
		const option = this.editingOption();
		if (!option) return;

		option.data = { ...this.form };

		if (option._id) {
			this.optionService.update(option).subscribe(() => {
				this.editingOption.set(null);
			});
		} else {
			this.optionService.create(option).subscribe(() => {
				this.editingOption.set(null);
			});
		}
	}

	protected delete(option: CertificateOption) {
		if (confirm('Ви впевнені, що хочете видалити цей шаблон?')) {
			this.optionService.delete(option).subscribe();
		}
	}

	protected cancel() {
		this.editingOption.set(null);
	}
}
