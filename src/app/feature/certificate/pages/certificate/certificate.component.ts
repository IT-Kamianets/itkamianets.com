import { ChangeDetectionStrategy, Component, inject, computed, signal, effect } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CertificateService } from '../../certificate.service';
import { Certificate } from '../../certificate.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-certificate',
	standalone: true,
	imports: [DatePipe, JsonPipe, RouterLink],
	templateUrl: './certificate.component.html',
	styleUrl: './certificate.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly certService = inject(CertificateService);
	
	private readonly idParams = toSignal(this.route.paramMap);
	protected readonly certId = computed(() => this.idParams()?.get('id'));

	protected readonly certificate = signal<Certificate | null>(null);
	protected readonly isLoading = signal<boolean>(false);

	constructor() {
		effect(() => {
			const id = this.certId();
			if (id) {
				this.isLoading.set(true);
				this.certService.fetchOne(id).subscribe(cert => {
					this.certificate.set(cert);
					this.isLoading.set(false);
				});
			} else {
				this.certificate.set(null);
			}
		});
	}
}
