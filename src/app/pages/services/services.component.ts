import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
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
	private readonly _serviceService = inject(ServiceService);
	private readonly _router = inject(Router);

	readonly categories = this._serviceService.categories;

	/** Set of collapsed category IDs */
	private readonly _collapsed = signal<Set<string>>(new Set());

	isCollapsed(id: string): boolean {
		return this._collapsed().has(id);
	}

	toggleCategory(id: string): void {
		this._collapsed.update((set) => {
			const next = new Set(set);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	}

	goToDetail(id: string): void {
		this._router.navigate(['/services', id]);
	}
}
