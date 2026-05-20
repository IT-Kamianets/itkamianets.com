import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { COURSES } from '../../course.data';

@Component({
	imports: [RouterLink],
	templateUrl: './lesson.component.html',
	styleUrl: './lesson.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonComponent {
	private readonly _route = inject(ActivatedRoute);
	private readonly _sanitizer = inject(DomSanitizer);
	private readonly _params = toSignal(
		this._route.params.pipe(
			map((params) => ({
				courseSlug: params['courseSlug'] as string,
				lessonSlug: params['lessonSlug'] as string,
			})),
		),
		{ initialValue: { courseSlug: '', lessonSlug: '' } },
	);

	readonly _entry = computed(() => {
		const params = this._params();
		const course = COURSES.find((item) => item.slug === params.courseSlug) ?? null;
		const lesson = course?.lessons.find((item) => item.slug === params.lessonSlug) ?? null;

		if (!course || !lesson) {
			return null;
		}

		return { course, lesson };
	});

	readonly _videoUrl = computed(() => {
		const entry = this._entry();

		if (!entry) {
			return null;
		}

		return this._sanitizer.bypassSecurityTrustResourceUrl(
			`https://www.youtube.com/embed/${entry.lesson.youtubeId}`,
		);
	});
}
