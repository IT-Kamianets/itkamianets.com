import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CourseService } from '../../course.service';

@Component({
  selector: 'add-course-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <p-dialog
      [visible]="open()"
      (visibleChange)="open.set($event)"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '600px' }"
      (onHide)="closeDialog()"
    >
      <ng-template pTemplate="header">
        <span class="text-xl font-bold">Додати курс</span>
      </ng-template>

      <div class="space-y-4">
        <div>
          <label class="block font-semibold mb-1">Фото курсу</label>
          <input
            type="file"
            (change)="onFileChange($event)"
            accept="image/*"
            class="block w-full border rounded p-2"
            [disabled]="isSubmitting()"
          />

          <div *ngIf="photoUrl" class="mt-2">
            <img
              [src]="photoUrl"
              alt="preview"
              class="w-24 h-24 object-cover rounded border"
            />
          </div>
        </div>

        <div>
          <label class="block font-semibold mb-1">Назва курсу</label>
          <input pInputText [(ngModel)]="form.title" class="w-full" [disabled]="isSubmitting()" />
        </div>

        <div>
          <label class="block font-semibold mb-1">Опис курсу</label>
          <textarea
            [(ngModel)]="form.description"
            rows="3"
            class="w-full border rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            [disabled]="isSubmitting()"
          ></textarea>
        </div>

        <div>
          <label class="block font-semibold mb-1">Теги курсу</label>
          <input
            pInputText
            [(ngModel)]="form.tags"
            class="w-full"
            placeholder="Введіть теги через кому"
            [disabled]="isSubmitting()"
          />
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block font-semibold mb-1">GitHub</label>
            <input pInputText [(ngModel)]="form.github" class="w-full" [disabled]="isSubmitting()" />
          </div>

          <div class="flex-1">
            <label class="block font-semibold mb-1">Вебсайт</label>
            <input pInputText [(ngModel)]="form.website" class="w-full" [disabled]="isSubmitting()" />
          </div>
        </div>

        <div>
          <label class="block font-semibold mb-1">Команда курсу</label>
          <input
            pInputText
            [(ngModel)]="form.team"
            class="w-full"
            placeholder="Введіть імена через кому"
            [disabled]="isSubmitting()"
          />
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex gap-2 justify-end mt-4">
          <button
            pButton
            type="button"
            label="Очистити"
            class="p-button-secondary"
            (click)="clear()"
            [disabled]="isSubmitting()"
          ></button>

          <button
            pButton
            type="button"
            label="Опублікувати"
            class="p-button-primary"
            (click)="submit()"
            [loading]="isSubmitting()"
            [disabled]="isSubmitting()"
          ></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [``],
})
export class AddCourseDialogComponent {
  @Output() courseAdded = new EventEmitter<void>();

  open = signal(false);
  isSubmitting = signal(false);

  photo: File | null = null;
  photoUrl: string | null = null;

  form: any = {
    title: '',
    description: '',
    tags: '',
    github: '',
    website: '',
    team: ''
  };

  private courseService = inject(CourseService);
  private messageService = inject(MessageService);

  show() {
    this.open.set(true);
  }

  closeDialog() {
    this.open.set(false);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.photo = file;

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.photoUrl = reader.result as string;
      };

      reader.readAsDataURL(file);
    } else {
      this.photoUrl = null;
    }
  }

  clear() {
    this.form = {
      title: '',
      description: '',
      tags: '',
      github: '',
      website: '',
      team: ''
    };

    this.photo = null;
    this.photoUrl = null;
  }

  submit() {
    // Валідація
    if (!this.form.title?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Увага',
        detail: 'Будь ласка, введіть назву курсу'
      });
      return;
    }

    if (!this.form.description?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Увага',
        detail: 'Будь ласка, введіть опис курсу'
      });
      return;
    }

    const data: any = {
      title: this.form.title,
      description: this.form.description,
      tags: this.form.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean),

      github: this.form.github,
      website: this.form.website,

      team: this.form.team
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean),

      photo: this.photoUrl
    };

    this.isSubmitting.set(true);
    this.courseService.createCourse(data).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успіх',
          detail: 'Курс успішно додано!'
        });
        this.courseAdded.emit();
        this.closeDialog();
        this.clear();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Помилка при додаванні курсу:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Помилка',
          detail: err?.error?.message || 'Не вдалося додати курс. Спробуйте ще раз.'
        });
        this.isSubmitting.set(false);
      }
    });
  }
}