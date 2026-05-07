import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { COURSES } from '../../course.data';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'course-manage-courses-page',
	standalone: true,
	imports: [CommonModule, NgFor, CardModule, ButtonModule],
	template: `
		<div class="p-6 max-w-4xl mx-auto">
			<h1 class="text-2xl font-bold mb-6">Manage Courses</h1>
			<div class="grid gap-4">
				<div *ngFor="let course of courses" class="">
					<p-card>
						<ng-template pTemplate="header">
							<span class="font-semibold">{{ course.title }}</span>
						</ng-template>
						<div class="text-gray-700 mb-2">{{ course.description }}</div>
						<div class="flex gap-2 mt-2">
							<button pButton type="button" label="View" class="p-button-sm"></button>
							<button pButton type="button" label="Edit" class="p-button-sm p-button-secondary"></button>
							<button pButton type="button" label="Delete" class="p-button-sm p-button-danger"></button>
						</div>
					</p-card>
				</div>
			</div>
		</div>
	`,
	styles: [``],
})
export class ManageCoursesPage {
	courses = COURSES;
}
