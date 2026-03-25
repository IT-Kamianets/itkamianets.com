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

	protected create() {
		const newDoc = this.optionService.new() as CertificateOption;
		newDoc.data = {};
		this.editingOption.set(newDoc);
	}

	protected edit(option: CertificateOption) {
		if (!option.data) option.data = {};
		const editOption = { ...option, data: { ...option.data } } as CertificateOption;
		this.editingOption.set(editOption);
	}

	protected save() {
		const option = this.editingOption();
		if (!option) return;

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
