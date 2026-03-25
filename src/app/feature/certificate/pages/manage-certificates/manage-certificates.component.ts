import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CertificateService } from '../../certificate.service';
import { CertificateOptionService } from '../../certificate-option.service';
import { Certificate } from '../../certificate.interface';

@Component({
	selector: 'app-manage-certificates',
	standalone: true,
	imports: [FormsModule, RouterLink],
	templateUrl: './manage-certificates.component.html',
	styleUrl: './manage-certificates.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCertificatesComponent {
	protected readonly certService = inject(CertificateService);
	protected readonly optionService = inject(CertificateOptionService);
	
	protected readonly certificates = this.certService.docs;
	protected readonly options = this.optionService.docs;

	protected readonly editingCert = signal<Certificate | null>(null);

	protected create() {
		const newDoc = this.certService.new() as Certificate;
		newDoc.data = {};
		this.editingCert.set(newDoc);
	}

	protected edit(cert: Certificate) {
		if (!cert.data) cert.data = {};
		const editCert = { ...cert, data: { ...cert.data } } as Certificate;
		this.editingCert.set(editCert);
	}

	protected save() {
		const cert = this.editingCert();
		if (!cert) return;

		if (cert._id) {
			this.certService.update(cert).subscribe(() => {
				this.editingCert.set(null);
			});
		} else {
			this.certService.create(cert).subscribe(() => {
				this.editingCert.set(null);
			});
		}
	}

	protected delete(cert: Certificate) {
		if (confirm('Ви впевнені, що хочете видалити цей сертифікат?')) {
			this.certService.delete(cert).subscribe();
		}
	}

	protected cancel() {
		this.editingCert.set(null);
	}

	protected applyTemplate(optionId: string) {
		const opt = this.options().find(o => o._id === optionId);
		if (opt) {
			const currentData = this.editingCert()!.data || {};
			const newData = { ...currentData, ...opt.data, templateStyle: opt.data?.['templateStyle'] || 'classic', title: opt.data?.['title'] || currentData['title'], description: opt.data?.['description'] || currentData['description'] };
			this.editingCert.update(c => c ? { ...c, data: newData } : c);
		}
	}
}
