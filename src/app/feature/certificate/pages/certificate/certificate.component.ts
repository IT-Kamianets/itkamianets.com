import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CertificateService } from '../../certificate.service';
import { Certificate } from '../../certificate.interface';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';

@Component({
	selector: 'app-certificate',
	standalone: true,
	imports: [DatePipe, RouterLink],
	templateUrl: './certificate.component.html',
	styleUrl: './certificate.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent {
	private readonly _route = inject(ActivatedRoute);
	private readonly _certService = inject(CertificateService);

	private readonly _idParams = toSignal(this._route.paramMap);
	protected readonly certificate = signal<Certificate | null>(null);
	protected readonly isLoading = signal<boolean>(false);

	constructor() {
		toObservable(this._idParams)
			.pipe(
				tap(() => this.isLoading.set(true)),
				switchMap((params) => {
					const id = params?.get('id');
					if (id) {
						return this._certService.fetchOne(id);
					}
					return [null];
				}),
				tap((cert) => {
					this.certificate.set(cert);
					this.isLoading.set(false);
				}),
			)
			.subscribe();
	}
}
