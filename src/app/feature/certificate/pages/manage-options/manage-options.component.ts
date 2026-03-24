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
	protected readonly editingDataStr = signal<string>('{}');

	protected create() {
		const newDoc = this.optionService.new() as CertificateOption;
		newDoc.data = {};
		this.editingOption.set(newDoc);
		this.editingDataStr.set(JSON.stringify(newDoc.data, null, 2));
	}

	protected edit(option: CertificateOption) {
		this.editingOption.set({ ...option });
		this.editingDataStr.set(JSON.stringify(option.data || {}, null, 2));
	}

	protected save() {
		const option = this.editingOption();
		if (!option) return;

		try {
			option.data = JSON.parse(this.editingDataStr());
		} catch (e) {
			alert('Invalid JSON in data field');
			return;
		}

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

	protected stringify(data: any): string {
		try {
			return JSON.stringify(data, null, 2);
		} catch {
			return '{}';
		}
	}
}
