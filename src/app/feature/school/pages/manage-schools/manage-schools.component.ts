import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { School, SchoolData, SchoolService, createEmptySchoolData } from '../../school.service';

@Component({
	imports: [CommonModule, TableModule, DialogModule, InputTextModule, ButtonModule],
	templateUrl: './manage-schools.component.html',
	styleUrl: './manage-schools.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSchoolsComponent implements OnInit {
	private readonly _schoolService = inject(SchoolService);

	protected readonly schools = signal<School[]>([]);
	protected readonly loading = signal(true);
	protected readonly saving = signal(false);
	protected readonly error = signal<string | null>(null);
	protected readonly isModalOpen = signal(false);
	protected readonly editingId = signal<string | null>(null);
	protected readonly draft = signal<SchoolData>(createEmptySchoolData());
	protected readonly modalTitle = computed(() => {
		return this.editingId() ? 'Редагувати заклад' : 'Додати новий заклад';
	});

	ngOnInit() {
		this.loadSchools();
	}

	protected loadSchools() {
		this.loading.set(true);
		this.error.set(null);

		this._schoolService
			.getSchools()
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: (schools) => this.schools.set(schools),
				error: (error: Error) => {
					this.error.set(error.message || 'Не вдалося завантажити школи.');
					this.schools.set([]);
				},
			});
	}

	protected openCreateModal() {
		this.editingId.set(null);
		this.draft.set(createEmptySchoolData());
		this.isModalOpen.set(true);
	}

	protected openEditModal(school: School) {
		this.editingId.set(school._id);
		this.draft.set({
			...createEmptySchoolData(),
			...school.data,
			courses: this.schoolCourses(school),
			lessons: this.schoolLessons(school),
		});
		this.isModalOpen.set(true);
	}

	protected closeModal() {
		this.isModalOpen.set(false);
		this.editingId.set(null);
		this.draft.set(createEmptySchoolData());
	}

	protected onDialogVisibleChange(visible: boolean) {
		if (!visible) {
			this.closeModal();
		}
	}

	protected saveSchool() {
		const draft = this.draft();
		if (!draft.title?.trim()) {
			this.error.set('Вкажіть назву закладу.');
			return;
		}

		const editingId = this.editingId();
		const request = editingId
			? this._schoolService.updateSchool(editingId, draft)
			: this._schoolService.createSchool(draft);

		this.saving.set(true);
		this.error.set(null);

		request.pipe(finalize(() => this.saving.set(false))).subscribe({
			next: (result) => {
				if (!result) {
					this.error.set('Не вдалося зберегти школу. Перевірте авторизацію та дані форми.');
					return;
				}

				this.closeModal();
				this.loadSchools();
			},
			error: (error: Error) => {
				this.error.set(error.message || 'Не вдалося зберегти школу.');
			},
		});
	}

	protected deleteSchool(school: School) {
		if (!confirm('Ви впевнені, що хочете видалити цей заклад?')) {
			return;
		}

		this.loading.set(true);
		this.error.set(null);

		this._schoolService
			.deleteSchool(school._id)
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: (deleted) => {
					if (!deleted) {
						this.error.set('Не вдалося видалити школу.');
						return;
					}

					this.loadSchools();
				},
				error: (error: Error) => {
					this.error.set(error.message || 'Не вдалося видалити школу.');
				},
			});
	}

	protected updateDraft(key: keyof SchoolData, value: unknown) {
		this.draft.update((draft) => ({
			...draft,
			[key]: value,
		}));
	}

	protected updateStringList(key: 'courses' | 'lessons', value: string) {
		this.updateDraft(
			key,
			value
				.split(/\r?\n|,/)
				.map((item) => item.trim())
				.filter(Boolean),
		);
	}

	protected stringListValue(key: 'courses' | 'lessons') {
		const value = this.draft()[key];

		return Array.isArray(value) ? value.join('\n') : '';
	}

	protected schoolTitle(school: School) {
		return school.data.title || 'Без назви';
	}

	protected schoolDescription(school: School) {
		return school.data.description || 'Опис не вказано';
	}

	protected schoolDescriptionPreview(school: School) {
		const description = this.schoolDescription(school);

		return description.length > 140 ? `${description.slice(0, 140)}...` : description;
	}

	protected schoolType(school: School) {
		return typeof school.data.type === 'string' && school.data.type.trim()
			? school.data.type.trim()
			: 'school';
	}

	protected schoolContact(school: School) {
		const contact = [school.data.phone, school.data.email].filter(
			(value): value is string => typeof value === 'string' && Boolean(value.trim()),
		);

		return contact.length ? contact.join(' / ') : '—';
	}

	protected schoolCourses(school: School) {
		return Array.isArray(school.data.courses) ? school.data.courses : [];
	}

	protected schoolLessons(school: School) {
		return Array.isArray(school.data.lessons) ? school.data.lessons : [];
	}
}
