import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../feature/service/service.service';

@Component({
	selector: 'app-services',
	imports: [DecimalPipe],
	templateUrl: './services.component.html',
	styleUrl: './services.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
	private readonly serviceService = inject(ServiceService);
	private readonly router = inject(Router);

	readonly services = this.serviceService.services;

	getProviderAvatar(avatar: string): string {
		return `developer/${avatar}.png`;
	}

	goToDetail(id: string): void {
		this.router.navigate(['/services', id]);
	}
}
