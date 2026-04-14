import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CertificateService } from '../../certificate.service';
import { Certificate } from '../../certificate.interface';

@Component({
	selector: 'app-certificates',
	standalone: true,
	imports: [RouterLink, DatePipe],
	templateUrl: './certificates.component.html',
	styleUrl: './certificates.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificatesComponent {
	protected readonly certService = inject(CertificateService);
	protected readonly certificates = this.certService.docs;

	readonly categories = ['All', 'Classic', 'Modern', 'Minimalist'] as const;
	activeFilter = signal<string>('All');

	setFilter(filter: string): void {
		this.activeFilter.set(filter);
	}

	get filteredCertificates(): Certificate[] {
		const f = this.activeFilter();
		if (f === 'All') return this.certificates();
		return this.certificates().filter(
			(cert) => cert.data?.templateStyle?.toLowerCase() === f.toLowerCase(),
		);
	}

	getCategoryLabel(style: string | undefined): string {
		switch (style) {
			case 'classic':
				return 'Класичний';
			case 'modern':
				return 'Сучасний';
			case 'minimalist':
				return 'Мінімалістичний';
			default:
				return 'Сертифікат';
		}
	}
}
