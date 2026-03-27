import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CertificateService } from '../../certificate.service';
import { CertificateOptionService } from '../../certificate-option.service';
import { CertificatePdfService } from '../../certificate-pdf.service';
import { Certificate } from '../../certificate.interface';

@Component({
	selector: 'app-manage-certificates',
	standalone: true,
	imports: [FormsModule, RouterLink, DatePipe],
	templateUrl: './manage-certificates.component.html',
	styleUrl: './manage-certificates.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCertificatesComponent {
	protected readonly certService = inject(CertificateService);
	protected readonly optionService = inject(CertificateOptionService);
	protected readonly pdfService = inject(CertificatePdfService);
	protected readonly cdr = inject(ChangeDetectorRef);
	
	protected readonly certificates = this.certService.docs;
	protected readonly options = this.optionService.docs;

	protected readonly editingCert = signal<Certificate | null>(null);
	protected form = {
		title: '',
		recipientName: '',
		description: '',
		issueDate: '',
		templateStyle: 'classic'
	};

	protected create() {
		this.form = {
			title: '',
			recipientName: '',
			description: '',
			issueDate: new Date().toISOString().slice(0, 16),
			templateStyle: 'classic'
		};
		this.editingCert.set(this.certService.new() as Certificate);
	}

	protected edit(cert: Certificate) {
		const data = cert.data || {};
		this.form = {
			title: data['title'] || '',
			recipientName: data['recipientName'] || '',
			description: data['description'] || '',
			issueDate: data['issueDate'] ? data['issueDate'].slice(0, 16) : '',
			templateStyle: data['templateStyle'] || 'classic'
		};
		this.editingCert.set(cert);
	}

	protected save() {
		const cert = this.editingCert();
		if (!cert) return;

		cert.data = { ...this.form };

		if (cert._id) {
			this.certService.update(cert).subscribe((res) => {
				if (res) {
					this.editingCert.set(null);
					this.cdr.markForCheck();
				} else {
					alert('Помилка: сервер відхилив оновлення сертифікату.');
				}
			});
		} else {
			this.certService.create(cert).subscribe((res) => {
				if (res) {
					this.editingCert.set(null);
					this.cdr.markForCheck();
				} else {
					alert('Помилка: сервер відхилив створення сертифікату.');
				}
			});
		}
	}

	protected delete(cert: Certificate) {
		if (confirm('Ви впевнені, що хочете видалити цей сертифікат?')) {
			this.certService.delete(cert).subscribe(() => {
				this.cdr.markForCheck();
			});
		}
	}

	protected cancel() {
		this.editingCert.set(null);
	}

	protected applyTemplate(optionId: string) {
		const opt = this.options().find(o => o._id === optionId);
		if (opt && opt.data) {
			this.form.title = opt.data['title'] || this.form.title;
			this.form.description = opt.data['description'] || this.form.description;
			this.form.templateStyle = opt.data['templateStyle'] || this.form.templateStyle;
			this.cdr.markForCheck();
		}
	}

	protected exportPdf(cert: Certificate) {
		this.pdfService.download(cert);
	}
}
