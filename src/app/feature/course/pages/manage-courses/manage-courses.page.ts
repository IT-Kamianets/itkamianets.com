import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { CourseService } from '../../course.service';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { AddCourseDialogComponent } from './add-course-dialog.component';

@Component({
	selector: 'course-manage-courses-page',
	standalone: true,
	imports: [CommonModule, NgFor, HttpClientModule, ButtonModule, AddCourseDialogComponent],
	template: `
		<div class="p-6 max-w-7xl mx-auto">
			<add-course-dialog #addDialog (courseAdded)="reload()"></add-course-dialog>
			<div class="flex items-center justify-between mb-2">
				<h1 class="text-2xl font-bold">Курси (Admin)</h1>
				<button pButton type="button" label="Додати курс" class="p-button-sm bg-blue-500 hover:bg-blue-600 text-white shadow-lg" style="min-width: 160px;" (click)="addDialog.show()"></button>
			</div>
			<div class="text-gray-500 mb-6">Керуйте публікаціями курсів: створюйте, переглядайте, редагуйте та видаляйте записи.</div>
			<div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
				<table class="min-w-full text-sm align-middle">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-4 py-3 text-left font-semibold">Фото</th>
							<th class="px-4 py-3 text-left font-semibold">Назва</th>
							<th class="px-4 py-3 text-left font-semibold">Опис</th>
							<th class="px-4 py-3 text-left font-semibold">Теги</th>
							<th class="px-4 py-3 text-left font-semibold">Дії</th>
						</tr>
					</thead>
					<tbody>
						<tr *ngFor="let course of courses()" class="border-b last:border-b-0">
							<td class="px-4 py-2">
								<img *ngIf="course.data?.photo" [src]="course.data.photo" alt="course" class="w-14 h-14 rounded object-cover border" />
								<span *ngIf="!course.data?.photo" class="block w-14 h-14 bg-gray-100 rounded"></span>
							</td>
							<td class="px-4 py-2 font-medium">{{ course.data?.title }}</td>
							<td class="px-4 py-2">{{ course.data?.description }}</td>
							<td class="px-4 py-2">
								<ng-container *ngIf="course.data?.tags as tags">
									<span *ngFor="let tag of tags" class="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1 mb-1">{{ tag }}</span>
								</ng-container>
							</td>
							<td class="px-4 py-2 flex gap-2">
								<button pButton type="button" label="Перегляд" class="p-button-sm"></button>
								<button pButton type="button" label="Редагувати" class="p-button-sm p-button-secondary"></button>
								<button pButton type="button" label="Видалити" class="p-button-sm p-button-danger"></button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
	styles: [``],
})
export class ManageCoursesPage {
	private courseService = inject(CourseService);
	private _courses = signal<any[]>([]);
	courses = this._courses.asReadonly();

	reload() {
		this.courseService.getCourses().subscribe((res: any) => {
			this._courses.set(res?.data || []);
		});
	}

	ngOnInit() {
		this.reload();
	}
}
