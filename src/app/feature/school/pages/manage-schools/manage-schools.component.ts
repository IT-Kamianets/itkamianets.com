import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
	EDUCATION_OWNERSHIP_OPTIONS,
	EDUCATION_STATUS_OPTIONS,
	EDUCATION_TYPE_OPTIONS,
	createEmptyEducationInstitutionDraft,
} from '../../../education/education.const';
import { EducationService } from '../../../education/education.service';
import {
	EducationInstitution,
	EducationInstitutionDraft,
	EducationInstitutionOwnership,
	EducationInstitutionStatus,
	EducationInstitutionType,
} from '../../../education/education.interface';

@Component({
	imports: [DecimalPipe],
	templateUrl: './manage-schools.component.html',
	styleUrl: './manage-schools.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSchoolsComponent {
	protected readonly educationService = inject(EducationService);
	protected readonly institutions = this.educationService.institutions;
	protected readonly typeOptions = EDUCATION_TYPE_OPTIONS;
	protected readonly ownershipOptions = EDUCATION_OWNERSHIP_OPTIONS;
	protected readonly statusOptions = EDUCATION_STATUS_OPTIONS;
	protected readonly isModalOpen = signal(false);
	protected readonly editingId = signal<string | null>(null);
	protected readonly draft = signal<EducationInstitutionDraft>(
		createEmptyEducationInstitutionDraft(),
	);
	protected readonly modalTitle = computed(() => {
		return this.editingId() ? 'Редагувати заклад' : 'Додати новий заклад';
	});

	protected openCreateModal() {
		this.editingId.set(null);
		this.draft.set(createEmptyEducationInstitutionDraft());
		this.isModalOpen.set(true);
	}

	protected openEditModal(institution: EducationInstitution) {
		this.editingId.set(institution.id);
		this.draft.set({
			name: institution.name,
			shortName: institution.shortName,
			type: institution.type,
			ownership: institution.ownership,
			status: institution.status,
			address: institution.address,
			district: institution.district,
			phone: institution.phone,
			email: institution.email,
			website: institution.website,
			principal: institution.principal,
			foundedYear: institution.foundedYear,
			notes: institution.notes,
			studentsCount: institution.studentsCount,
			featured: institution.featured,
			published: institution.published,
		});
		this.isModalOpen.set(true);
	}

	protected closeModal() {
		this.isModalOpen.set(false);
		this.editingId.set(null);
		this.draft.set(createEmptyEducationInstitutionDraft());
	}

	protected saveInstitution() {
		const draft = this.draft();
		const editingId = this.editingId();

		this.educationService.upsertInstitution(draft, editingId);

		this.closeModal();
	}

	protected deleteInstitution(id: string) {
		if (!confirm('Ви впевнені, що хочете видалити цей заклад?')) {
			return;
		}

		this.educationService.removeInstitution(id);
	}

	protected updateDraft(key: keyof EducationInstitutionDraft, value: unknown) {
		this.draft.update((draft) => ({
			...draft,
			[key]: value,
		}));
	}

	protected typeLabel(value: EducationInstitutionType): string {
		return EDUCATION_TYPE_OPTIONS.find((option) => option.value === value)?.label || value;
	}

	protected ownershipLabel(value: EducationInstitutionOwnership): string {
		return EDUCATION_OWNERSHIP_OPTIONS.find((option) => option.value === value)?.label || value;
	}
}
