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
	private readonly _certService = inject(CertificateService);
	private readonly _optionService = inject(CertificateOptionService);
	private readonly _pdfService = inject(CertificatePdfService);
	private readonly _cdr = inject(ChangeDetectorRef);
	
	protected readonly certificates = this._certService.docs;
	protected readonly options = this._optionService.docs;

	constructor() {
		this._optionService.getAll().subscribe();
	}

	protected readonly editingCert = signal<Certificate | null>(null);
	protected readonly selectedTemplateId = signal<string>('');
	protected readonly form = signal({
		title: '',
		recipientName: '',
		description: '',
		issueDate: '',
		templateStyle: 'classic'
	});

	private _toDateTimeLocal(value: string | Date): string {
		const date = new Date(value);
		if (isNaN(date.getTime())) {
			return '';
		}
		const offset = date.getTimezoneOffset() * 60000;
		const localDate = new Date(date.getTime() - offset);
		return localDate.toISOString().slice(0, 16);
	}

	protected create() {
		this.form.set({
			title: '',
			recipientName: '',
			description: '',
			issueDate: this._toDateTimeLocal(new Date()),
			templateStyle: 'classic'
		});
		this.selectedTemplateId.set('');
		this.editingCert.set(this._certService.new() as Certificate);
	}

	protected edit(cert: Certificate) {
		const data = cert.data || {};
		this.form.set({
			title: data['title'] || '',
			recipientName: data['recipientName'] || '',
			description: data['description'] || '',
			issueDate: data['issueDate'] ? this._toDateTimeLocal(data['issueDate']) : '',
			templateStyle: data['templateStyle'] || 'classic'
		});
		this.selectedTemplateId.set('');
		this.editingCert.set(cert);
	}

	protected updateFormField(field: string, value: any) {
		this.form.update(f => ({ ...f, [field]: value }));
	}

	protected save() {
		const cert = this.editingCert();
		if (!cert) return;

		cert.data = { ...this.form() };

		if (cert._id) {
			this._certService.update(cert).subscribe((res) => {
				if (res) {
					this.editingCert.set(null);
					this._cdr.markForCheck();
				} else {
					alert('Помилка: сервер відхилив оновлення сертифікату.');
				}
			});
		} else {
			this._certService.create(cert).subscribe((res) => {
				if (res) {
					this.editingCert.set(null);
					this._cdr.markForCheck();
				} else {
					alert('Помилка: сервер відхилив створення сертифікату.');
				}
			});
		}
	}

	protected delete(cert: Certificate) {
		if (confirm('Ви впевнені, що хочете видалити цей сертифікат?')) {
			this._certService.delete(cert).subscribe((success) => {
				if (success) {
					this._cdr.markForCheck();
				} else {
					alert('Помилка: не вдалося видалити сертифікат.');
				}
			});
		}
	}

	protected cancel() {
		this.editingCert.set(null);
	}

	protected applyTemplate(optionId: string) {
		this.selectedTemplateId.set(optionId);
		const opt = this.options().find(o => o._id === optionId);
		if (opt && opt.data) {
			this.form.update(f => ({
				...f,
				title: opt.data?.['title'] || f.title,
				description: opt.data?.['description'] || f.description,
				templateStyle: opt.data?.['templateStyle'] || f.templateStyle
			}));
			this._cdr.markForCheck();
		}
	}

	protected exportPdf(cert: Certificate) {
		this._pdfService.download(cert);
	}
}
