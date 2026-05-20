import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { COURSES } from '../../course.data';

@Component({
	imports: [RouterLink],
	templateUrl: './course.component.html',
	styleUrl: './course.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent {
	private readonly _route = inject(ActivatedRoute);
	private readonly _slug = toSignal(
		this._route.params.pipe(map((params) => params['slug'] as string)),
		{ initialValue: '' },
	);

	readonly _course = computed(
		() => COURSES.find((course) => course.slug === this._slug()) ?? null,
	);
}
