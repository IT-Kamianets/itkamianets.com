import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../feature/service/service.service';

@Component({
	selector: 'app-service-detail',
	imports: [DecimalPipe],
	templateUrl: './service-detail.component.html',
	styleUrl: './service-detail.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly serviceService = inject(ServiceService);

	readonly service = computed(() => {
		const id = this.route.snapshot.paramMap.get('id');
		return this.serviceService.services().find((s) => s.id === id) ?? null;
	});

	getProviderAvatar(avatar: string): string {
		return `/developer/${avatar}.png`;
	}

	goBack(): void {
		this.router.navigate(['/services']);
	}

	order(): void {
		this.router.navigate(['/contacts']);
	}
}
