import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	templateUrl: './section.component.html',
	styleUrl: './section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
	private readonly _route = inject(ActivatedRoute);

	protected readonly title = computed(() => {
		return (this._route.snapshot.data['title'] as string | undefined) || 'Manage Section';
	});
}
