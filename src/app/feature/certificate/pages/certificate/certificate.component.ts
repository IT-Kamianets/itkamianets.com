import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CertificateService } from '../../certificate.service';
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

	protected readonly certificate = computed(() => {
		const id = this.certId();
		if (!id) return null;
		return this.certService.docs().find(c => c._id === id);
	});
}
