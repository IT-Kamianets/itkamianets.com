import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COURSES } from '../../course.data';

@Component({
	imports: [RouterLink],
	templateUrl: './courses.component.html',
	styleUrl: './courses.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent {
	readonly _courses = COURSES;
}
