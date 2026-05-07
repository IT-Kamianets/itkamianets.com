import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { CourseService } from '../../course.service';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AddCourseDialogComponent } from './add-course-dialog.component';

@Component({
	selector: 'course-manage-courses-page',
	standalone: true,
	imports: [CommonModule, NgFor, HttpClientModule, ButtonModule, ToastModule, AddCourseDialogComponent],
	providers: [MessageService],
	template: `
		<p-toast></p-toast>
		<div class="p-6 max-w-7xl mx-auto">
			<add-course-dialog #addDialog (courseAdded)="onCourseAdded()"></add-course-dialog>
			<div class="flex items-center justify-between mb-2">
				<h1 class="text-2xl font-bold">Курси (Admin)</h1>
				<button pButton type="button" label="Додати курс" class="p-button-sm bg-blue-500 hover:bg-blue-600 text-white shadow-lg" style="min-width: 160px;" (click)="addDialog.show()"></button>
			</div>
			<div class="text-gray-500 mb-6">Керуйте публікаціями курсів: створюйте, переглядайте, редагуйте та видаляйте записи.</div>
			
			<div *ngIf="error()" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				<p class="font-semibold">❌ Помилка</p>
				<p>{{ error() }}</p>
			</div>
			
			<div *ngIf="isLoading()" class="text-center py-8">
				<p class="text-gray-500">Завантаження курсів...</p>
			</div>
			
			<div *ngIf="!isLoading() && courses().length === 0 && !error()" class="text-center py-8">
				<p class="text-gray-500">Курсів не знайдено. Додайте перший курс, щоб почати.</p>
			</div>

			<div *ngIf="!isLoading() && courses().length > 0" class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
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
								<img *ngIf="course.photo" [src]="course.photo" alt="course" class="w-14 h-14 rounded object-cover border" />
								<span *ngIf="!course.photo" class="block w-14 h-14 bg-gray-100 rounded"></span>
							</td>
							<td class="px-4 py-2 font-medium">{{ course.title }}</td>
							<td class="px-4 py-2">{{ course.description }}</td>
							<td class="px-4 py-2">
								<ng-container *ngIf="course.tags as tags">
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
	private messageService = inject(MessageService);
	private _courses = signal<any[]>([]);
	private _isLoading = signal(false);
	private _error = signal<string | null>(null);
	
	courses = this._courses.asReadonly();
	isLoading = this._isLoading.asReadonly();
	error = this._error.asReadonly();

	reload() {
		this._isLoading.set(true);
		this._error.set(null);
		this.courseService.getCourses().subscribe({
			next: (res: any) => {
				console.log('API Response:', res);
				// Спробуємо різні можливі структури
				const courses = res?.data || res?.courses || res || [];
				console.log('Parsed courses:', courses);
				this._courses.set(Array.isArray(courses) ? courses : []);
				this._isLoading.set(false);
			},
			error: (err) => {
				console.error('Помилка завантаження курсів:', err);
				const errorMessage = err?.error?.message || 'Не вдалося завантажити курси';
				this._error.set(errorMessage);
				this.messageService.add({
					severity: 'error',
					summary: 'Помилка',
					detail: errorMessage
				});
				this._isLoading.set(false);
			}
		});
	}

	onCourseAdded() {
		this.messageService.add({
			severity: 'success',
			summary: 'Успіх',
			detail: 'Курс успішно додано'
		});
		this.reload();
	}

	ngOnInit() {
		this.reload();
	}
}
