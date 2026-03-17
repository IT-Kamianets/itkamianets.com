import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
	EDUCATION_OWNERSHIP_OPTIONS,
	EDUCATION_STATUS_OPTIONS,
	EDUCATION_TYPE_OPTIONS,
	createEmptyEducationInstitutionDraft,
} from '../../../feature/education/education.const';
import { EducationService } from '../../../feature/education/education.service';
import {
	EducationInstitution,
	EducationInstitutionDraft,
	EducationInstitutionOwnership,
	EducationInstitutionStatus,
	EducationInstitutionType,
} from '../../../feature/education/education.interface';

@Component({
	imports: [DecimalPipe],
	templateUrl: './shcools.component.html',
	styleUrl: './shcools.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShcoolsComponent {
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
			address: institution.address,
			district: institution.district,
			phone: institution.phone,
			email: institution.email,
			website: institution.website,
			principal: institution.principal,
			studentsCount: institution.studentsCount,
			foundedYear: institution.foundedYear,
			status: institution.status,
			featured: institution.featured,
			published: institution.published,
			notes: institution.notes,
		});
		this.isModalOpen.set(true);
	}

	protected closeModal() {
		this.isModalOpen.set(false);
		this.editingId.set(null);
	}

	protected updateDraft(field: keyof EducationInstitutionDraft, value: string | number | boolean) {
		this.draft.update((draft) => ({
			...draft,
			[field]: value as never,
		}));
	}

	protected saveInstitution() {
		const draft = this.draft();
		if (!draft.name.trim() || !draft.shortName.trim() || !draft.address.trim()) {
			return;
		}

		this.educationService.upsertInstitution(
			{
				...draft,
				name: draft.name.trim(),
				shortName: draft.shortName.trim(),
				address: draft.address.trim(),
				district: draft.district.trim(),
				phone: draft.phone.trim(),
				email: draft.email.trim(),
				website: draft.website.trim(),
				principal: draft.principal.trim(),
				notes: draft.notes.trim(),
			},
			this.editingId(),
		);

		this.closeModal();
	}

	protected typeLabel(value: EducationInstitutionType) {
		return this.typeOptions.find((option) => option.value === value)?.label || value;
	}

	protected ownershipLabel(value: EducationInstitutionOwnership) {
		return this.ownershipOptions.find((option) => option.value === value)?.label || value;
	}

	protected statusLabel(value: EducationInstitutionStatus) {
		return this.statusOptions.find((option) => option.value === value)?.label || value;
	}
}