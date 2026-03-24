import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, JsonPipe } from '@angular/common';
import { CertificateService } from '../../certificate.service';

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
}
