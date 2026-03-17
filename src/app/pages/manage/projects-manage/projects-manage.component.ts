import {
	ChangeDetectionStrategy,
	Component,
	WritableSignal,
	computed,
	inject,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TEAM_MEMBERS, TeamMember } from '../../../data/team.data';
import { ProjectService } from '../../../feature/project/project.service';
import { ManagedProject, ManagedProjectDraft, ProjectCategory } from '../../../feature/project/project.interface';

type TabKey = 'create' | 'publications';

interface ProjectFormModel {
	title: FormControl<string>;
	description: FormControl<string>;
	tags: FormControl<string[]>;
	repoUrl: FormControl<string>;
	liveUrl: FormControl<string>;
	image: FormControl<string>;
	memberIds: FormControl<number[]>;
}

const minArrayLength = (min: number): ValidatorFn => {
	return (control): ValidationErrors | null => {
		const value = control.value;
		if (!Array.isArray(value)) {
			return { minArrayLength: true };
		}

		return value.length >= min ? null : { minArrayLength: true };
	};
};

@Component({
	templateUrl: './projects-manage.component.html',
	styleUrl: './projects-manage.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, ReactiveFormsModule],
})
export class ProjectsManageComponent {
	private readonly _projectService = inject(ProjectService);

	protected readonly activeTab = signal<TabKey>('create');
	protected readonly tagsOpen = signal(false);
	protected readonly membersOpen = signal(false);
	protected readonly isPreviewOpen = signal(false);
	protected readonly deleteCandidate = signal<ManagedProject | null>(null);
	protected readonly editProjectId = signal<string | null>(null);
	protected readonly isEditOpen = signal(false);
	protected readonly createSubmitted = signal(false);
	protected readonly editSubmitted = signal(false);
	protected readonly previewProject = signal<ManagedProject | null>(null);
	protected readonly createImageName = signal('Фото не вибрано');
	protected readonly editImageName = signal('Фото не вибрано');

	protected readonly tagOptions: string[] = [
		'Tailwind',
		'Bulma',
		'Bootstrap',
		'Angular',
		'TypeScript',
		'Node.js',
		'SSR',
		'Landing',
		'E-commerce',
		'Portfolio',
		'Dashboard',
		'Education',
		'Healthcare',
		'UI/UX',
		'Responsive',
	];

	protected readonly teamMembers: TeamMember[] = TEAM_MEMBERS;
	protected readonly projects = computed(() => this._projectService.projects());

	protected readonly createForm = this._createForm();
	protected readonly editForm = this._createForm();

	protected readonly selectedTagsText = computed(() => {
		const selected = this.createForm.controls.tags.value;
		return selected.length ? selected.join(', ') : 'Оберіть теги';
	});

	protected readonly selectedMembersText = computed(() => {
		const selected = this.createForm.controls.memberIds.value
			.map((id) => this.teamMembers.find((member) => member.id === id)?.name || '')
			.filter((name) => Boolean(name));
		return selected.length ? selected.join(', ') : 'Оберіть учасників';
	});

	protected switchTab(tab: TabKey): void {
		this.activeTab.set(tab);
	}

	protected toggleTagsDropdown(): void {
		this.tagsOpen.update((current) => !current);
	}

	protected toggleMembersDropdown(): void {
		this.membersOpen.update((current) => !current);
	}

	protected toggleCreateTag(tag: string): void {
		this._toggleArrayValue(this.createForm.controls.tags, tag);
	}

	protected toggleCreateMember(memberId: number): void {
		this._toggleArrayValue(this.createForm.controls.memberIds, memberId);
	}

	protected onCreateImageChange(event: Event): void {
		this._readImage(event, this.createForm.controls.image, this.createImageName);
	}

	protected onEditImageChange(event: Event): void {
		this._readImage(event, this.editForm.controls.image, this.editImageName);
	}

	protected clearCreateForm(): void {
		this.createForm.reset({
			title: '',
			description: '',
			tags: [],
			repoUrl: '',
			liveUrl: '',
			image: '',
			memberIds: [],
		});
		this.createImageName.set('Фото не вибрано');
		this.createSubmitted.set(false);
		this.tagsOpen.set(false);
		this.membersOpen.set(false);
	}

	protected openDraftPreview(): void {
		this.createSubmitted.set(true);
		if (this.createForm.invalid) {
			this.createForm.markAllAsTouched();
			return;
		}

		const draft = this._buildDraft(this.createForm);
		this.previewProject.set(this._draftToPreviewProject(draft));
		this.isPreviewOpen.set(true);
	}

	protected publishProject(): void {
		this.createSubmitted.set(true);
		if (this.createForm.invalid) {
			this.createForm.markAllAsTouched();
			return;
		}

		const draft = this._buildDraft(this.createForm);
		this._projectService.createProject(draft);
		this.clearCreateForm();
		this.activeTab.set('publications');
	}

	protected openProjectPreview(project: ManagedProject): void {
		this.previewProject.set(project);
		this.isPreviewOpen.set(true);
	}

	protected closePreview(): void {
		this.isPreviewOpen.set(false);
		this.previewProject.set(null);
	}

	protected openEdit(project: ManagedProject): void {
		this.editProjectId.set(project.id);
		this.editForm.reset({
			title: project.title,
			description: project.description,
			tags: [...project.tags],
			repoUrl: project.repoUrl,
			liveUrl: project.liveUrl,
			image: project.image,
			memberIds: [...project.memberIds],
		});
		this.editImageName.set(project.imageKind === 'asset' ? `${project.image}.png` : 'upload.png');
		this.editSubmitted.set(false);
		this.isEditOpen.set(true);
	}

	protected closeEdit(): void {
		this.isEditOpen.set(false);
		this.editProjectId.set(null);
		this.editSubmitted.set(false);
	}

	protected saveEdit(): void {
		this.editSubmitted.set(true);
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		const id = this.editProjectId();
		if (!id) {
			return;
		}

		const draft = this._buildDraft(this.editForm);
		this._projectService.updateProject(id, draft);
		this.closeEdit();
	}

	protected toggleEditTag(tag: string): void {
		this._toggleArrayValue(this.editForm.controls.tags, tag);
	}

	protected toggleEditMember(memberId: number): void {
		this._toggleArrayValue(this.editForm.controls.memberIds, memberId);
	}

	protected askDelete(project: ManagedProject): void {
		this.deleteCandidate.set(project);
	}

	protected cancelDelete(): void {
		this.deleteCandidate.set(null);
	}

	protected confirmDelete(): void {
		const candidate = this.deleteCandidate();
		if (!candidate) {
			return;
		}

		this._projectService.removeProject(candidate.id);
		this.deleteCandidate.set(null);
	}

	protected isTagSelected(tag: string): boolean {
		return this.createForm.controls.tags.value.includes(tag);
	}

	protected isMemberSelected(memberId: number): boolean {
		return this.createForm.controls.memberIds.value.includes(memberId);
	}

	protected isEditTagSelected(tag: string): boolean {
		return this.editForm.controls.tags.value.includes(tag);
	}

	protected isEditMemberSelected(memberId: number): boolean {
		return this.editForm.controls.memberIds.value.includes(memberId);
	}

	protected getImageSrc(project: ManagedProject): string {
		return project.imageKind === 'upload' ? project.image : `project/${project.image}.png`;
	}

	protected getMemberById(id: number): TeamMember | undefined {
		return this.teamMembers.find((member) => member.id === id);
	}

	protected getBadgeLabel(project: ManagedProject): string {
		switch (project.category) {
			case 'theme-tailwind':
				return 'Tailwind';
			case 'theme-bulma':
				return 'Bulma';
			case 'theme-bootstrap':
				return 'Bootstrap';
			default:
				return 'Project';
		}
	}

	protected getBadgeClass(project: ManagedProject): string {
		switch (project.category) {
			case 'theme-tailwind':
				return 'project-card__badge--tailwind';
			case 'theme-bulma':
				return 'project-card__badge--bulma';
			case 'theme-bootstrap':
				return 'project-card__badge--bootstrap';
			default:
				return 'project-card__badge--custom';
		}
	}

	protected trackByProjectId(_: number, project: ManagedProject): string {
		return project.id;
	}

	private _createForm(): FormGroup<ProjectFormModel> {
		return new FormGroup<ProjectFormModel>({
			title: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(2)],
			}),
			description: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(20)],
			}),
			tags: new FormControl<string[]>([], {
				nonNullable: true,
				validators: [minArrayLength(1)],
			}),
			repoUrl: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.pattern(/^https?:\/\/.+/i)],
			}),
			liveUrl: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.pattern(/^https?:\/\/.+/i)],
			}),
			image: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required],
			}),
			memberIds: new FormControl<number[]>([], {
				nonNullable: true,
				validators: [minArrayLength(1)],
			}),
		});
	}

	private _toggleArrayValue<T>(control: FormControl<T[]>, value: T): void {
		const current = control.value;
		const next = current.includes(value)
			? current.filter((item) => item !== value)
			: [...current, value];
		control.setValue(next);
		control.markAsTouched();
		control.updateValueAndValidity();
	}

	private _buildDraft(form: FormGroup<ProjectFormModel>): ManagedProjectDraft {
		const tags = form.controls.tags.value;
		return {
			title: form.controls.title.value.trim(),
			description: form.controls.description.value.trim(),
			tags,
			repoUrl: form.controls.repoUrl.value.trim(),
			liveUrl: form.controls.liveUrl.value.trim(),
			image: form.controls.image.value,
			imageKind: this._isDataUrl(form.controls.image.value) ? 'upload' : 'asset',
			memberIds: form.controls.memberIds.value,
			category: this._resolveCategory(tags),
		};
	}

	private _resolveCategory(tags: string[]): ProjectCategory {
		const normalized = tags.map((tag) => tag.toLowerCase());
		if (normalized.includes('tailwind')) {
			return 'theme-tailwind';
		}
		if (normalized.includes('bulma')) {
			return 'theme-bulma';
		}
		if (normalized.includes('bootstrap')) {
			return 'theme-bootstrap';
		}
		return 'custom';
	}

	private _readImage(
		event: Event,
		control: FormControl<string>,
		nameSignal: WritableSignal<string>,
	): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			return;
		}

		nameSignal.set(file.name);
		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === 'string' ? reader.result : '';
			control.setValue(result);
			control.markAsTouched();
			control.updateValueAndValidity();
		};
		reader.readAsDataURL(file);
	}

	private _isDataUrl(value: string): boolean {
		return value.startsWith('data:image/');
	}

	private _draftToPreviewProject(draft: ManagedProjectDraft): ManagedProject {
		const now = new Date().toISOString();
		return {
			id: 'preview',
			...draft,
			createdAt: now,
			updatedAt: now,
		};
	}
}
