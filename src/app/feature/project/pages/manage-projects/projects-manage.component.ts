import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	WritableSignal,
	computed,
	inject,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TEAM_MEMBERS, TeamMember } from '../../../../data/team.data';
import { Project, ProjectData } from '../../project.interface';
import { ProjectService } from '../../project.service';

interface ProjectFormModel {
	photo: FormControl<string>;
	title: FormControl<string>;
	description: FormControl<string>;
	tags: FormControl<string[]>;
	websiteLink: FormControl<string>;
	githubLink: FormControl<string>;
	team: FormControl<number[]>;
}

interface ToastItem {
	id: number;
	message: string;
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
	imports: [CommonModule, ReactiveFormsModule, TableModule, DialogModule, InputTextModule, ButtonModule],
})
export class ProjectsManageComponent {
	private readonly _projectService = inject(ProjectService);
	private _toastId = 0;

	protected readonly isCreateDialogOpen = signal(false);
	protected readonly tagsOpen = signal(false);
	protected readonly membersOpen = signal(false);
	protected readonly isPreviewOpen = signal(false);
	protected readonly isPhotoPreviewOpen = signal(false);
	protected readonly deleteCandidate = signal<Project | null>(null);
	protected readonly editProjectId = signal<string | null>(null);
	protected readonly isEditOpen = signal(false);
	protected readonly createSubmitted = signal(false);
	protected readonly editSubmitted = signal(false);
	protected readonly previewProject = signal<Project | null>(null);
	protected readonly createImageName = signal('Фото не вибрано');
	protected readonly editImageName = signal('Фото не вибрано');
	protected readonly projects = signal<Project[]>([]);
	protected readonly apiError = signal('');
	protected readonly toasts = signal<ToastItem[]>([]);

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
	protected readonly createForm = this._createForm();
	protected readonly editForm = this._createForm();

	protected readonly previewImageSrc = computed(() => {
		const project = this.previewProject();
		if (!project) {
			return '';
		}

		return this.getImageSrc(project);
	});

	constructor() {
		this._loadProjects();
	}

	protected openCreateDialog(): void {
		this.clearCreateForm();
		this.apiError.set('');
		this.isCreateDialogOpen.set(true);
	}

	protected closeCreateDialog(): void {
		this.isCreateDialogOpen.set(false);
		this.tagsOpen.set(false);
		this.membersOpen.set(false);
	}

	protected onCreateDialogVisibleChange(visible: boolean): void {
		this.isCreateDialogOpen.set(visible);
		if (!visible) {
			this.tagsOpen.set(false);
			this.membersOpen.set(false);
		}
	}

	protected toggleTagsDropdown(): void {
		const next = !this.tagsOpen();
		this.tagsOpen.set(next);
		if (next) {
			this.membersOpen.set(false);
		}
	}

	protected toggleMembersDropdown(): void {
		const next = !this.membersOpen();
		this.membersOpen.set(next);
		if (next) {
			this.tagsOpen.set(false);
		}
	}

	protected toggleCreateTag(tag: string): void {
		this._toggleArrayValue(this.createForm.controls.tags, tag);
	}

	protected toggleCreateMember(memberId: number): void {
		this._toggleArrayValue(this.createForm.controls.team, memberId);
	}

	protected onCreateImageChange(event: Event): void {
		this._readImage(event, this.createForm.controls.photo, this.createImageName);
	}

	protected onEditImageChange(event: Event): void {
		this._readImage(event, this.editForm.controls.photo, this.editImageName);
	}

	protected clearCreateForm(): void {
		this.createForm.reset({
			photo: '',
			title: '',
			description: '',
			tags: [],
			websiteLink: '',
			githubLink: '',
			team: [],
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

		const payload = this._buildPayload(this.createForm);
		this.previewProject.set({ _id: 'preview', data: payload });
		this.isPreviewOpen.set(true);
	}

	protected openEditDraftPreview(): void {
		this.editSubmitted.set(true);
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		const payload = this._buildPayload(this.editForm);
		this.previewProject.set({ _id: 'preview', data: payload });
		this.isPreviewOpen.set(true);
	}

	protected publishProject(): void {
		this.createSubmitted.set(true);
		this.apiError.set('');
		if (this.createForm.invalid) {
			this.createForm.markAllAsTouched();
			return;
		}

		const payload = this._buildPayload(this.createForm);
		this._projectService.create(payload).subscribe({
			next: (created) => {
				if (!created) {
					this.apiError.set('Не вдалося зберегти проєкт. Спробуйте пізніше.');
					return;
				}

				this.closeCreateDialog();
				this.clearCreateForm();
				this._loadProjects();
				this._showToast('Проєкт успішно опубліковано!');
				window.scrollTo({ top: 0, behavior: 'smooth' });
			},
			error: () => {
				this.apiError.set('Не вдалося зберегти проєкт. Спробуйте пізніше.');
			},
		});
	}

	protected openProjectPreview(project: Project): void {
		if (!project._id) {
			this.previewProject.set(project);
			this.isPreviewOpen.set(true);
			return;
		}

		this._projectService.fetchOne(project._id).subscribe({
			next: (fetched) => {
				this.previewProject.set(fetched || project);
				this.isPreviewOpen.set(true);
			},
			error: () => {
				this.previewProject.set(project);
				this.isPreviewOpen.set(true);
			},
		});
	}

	protected closePreview(): void {
		this.isPreviewOpen.set(false);
		this.previewProject.set(null);
	}

	protected openPhotoPreview(project: Project): void {
		this.previewProject.set(project);
		this.isPhotoPreviewOpen.set(true);
	}

	protected closePhotoPreview(): void {
		this.isPhotoPreviewOpen.set(false);
	}

	protected openEdit(project: Project): void {
		const data = project.data || {};
		this.editProjectId.set(project._id || null);
		this.editForm.reset({
			photo: data.photo || '',
			title: data.title || '',
			description: data.description || '',
			tags: Array.isArray(data.tags) ? [...data.tags] : [],
			websiteLink: data.websiteLink || '',
			githubLink: data.githubLink || '',
			team: Array.isArray(data.team) ? [...data.team] : [],
		});
		this.editImageName.set(data.imageKind === 'asset' ? `${data.photo || ''}.png` : 'upload.png');
		this.editSubmitted.set(false);
		this.tagsOpen.set(false);
		this.membersOpen.set(false);
		this.isEditOpen.set(true);
	}

	protected closeEdit(): void {
		this.isEditOpen.set(false);
		this.editProjectId.set(null);
		this.editSubmitted.set(false);
		this.tagsOpen.set(false);
		this.membersOpen.set(false);
	}

	protected onEditDialogVisibleChange(visible: boolean): void {
		this.isEditOpen.set(visible);
		if (!visible) {
			this.editProjectId.set(null);
			this.editSubmitted.set(false);
			this.tagsOpen.set(false);
			this.membersOpen.set(false);
		}
	}

	protected saveEdit(): void {
		this.editSubmitted.set(true);
		this.apiError.set('');
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		const id = this.editProjectId();
		if (!id) {
			return;
		}

		const payload = this._buildPayload(this.editForm);
		this._projectService.update(id, payload).subscribe({
			next: (updated) => {
				if (!updated) {
					this.apiError.set('Не вдалося оновити проєкт. Спробуйте пізніше.');
					return;
				}

				this.closeEdit();
				this._loadProjects();
				this._showToast('Дані проєкту успішно оновлено!');
			},
			error: () => {
				this.apiError.set('Не вдалося оновити проєкт. Спробуйте пізніше.');
			},
		});
	}

	protected toggleEditTag(tag: string): void {
		this._toggleArrayValue(this.editForm.controls.tags, tag);
	}

	protected toggleEditMember(memberId: number): void {
		this._toggleArrayValue(this.editForm.controls.team, memberId);
	}

	protected askDelete(project: Project): void {
		this.deleteCandidate.set(project);
	}

	protected cancelDelete(): void {
		this.deleteCandidate.set(null);
	}

	protected confirmDelete(): void {
		const candidate = this.deleteCandidate();
		if (!candidate?._id) {
			return;
		}

		this.apiError.set('');

		this._projectService.delete(candidate._id).subscribe({
			next: (deleted) => {
				if (!deleted) {
					this.apiError.set('Не вдалося видалити проєкт. Спробуйте ще раз.');
					return;
				}

				this.deleteCandidate.set(null);
				this._loadProjects();
				this._showToast('Проєкт успішно видалено!');
			},
			error: () => {
				this.apiError.set('Не вдалося видалити проєкт. Спробуйте пізніше.');
			},
		});
	}

	protected isTagSelected(tag: string): boolean {
		return this.createForm.controls.tags.value.includes(tag);
	}

	protected isMemberSelected(memberId: number): boolean {
		return this.createForm.controls.team.value.includes(memberId);
	}

	protected isEditTagSelected(tag: string): boolean {
		return this.editForm.controls.tags.value.includes(tag);
	}

	protected isEditMemberSelected(memberId: number): boolean {
		return this.editForm.controls.team.value.includes(memberId);
	}

	protected getImageSrc(project: Project): string {
		const image = project.data.photo;
		if (!image) {
			return 'project/ai-lab.itkamianets.com.png';
		}

		return project.data.imageKind === 'upload' ? image : `project/${image}.png`;
	}

	protected getMemberById(id: number): TeamMember | undefined {
		return this.teamMembers.find((member) => member.id === id);
	}

	protected getSelectedMembersText(memberIds: number[]): string {
		const names = memberIds
			.map((id) => this.getMemberById(id)?.name || '')
			.filter((name) => Boolean(name));
		return names.length ? names.join(', ') : 'Оберіть команду проєкту';
	}

	protected trackByProjectId(index: number, project: Project): string {
		return project._id || String(index);
	}

	@HostListener('document:click', ['$event'])
	protected onDocumentClick(event: MouseEvent): void {
		if (!this.tagsOpen() && !this.membersOpen()) {
			return;
		}

		const target = event.target as HTMLElement | null;
		if (target?.closest('.multi-select')) {
			return;
		}

		this.tagsOpen.set(false);
		this.membersOpen.set(false);
	}

	private _createForm(): FormGroup<ProjectFormModel> {
		return new FormGroup<ProjectFormModel>({
			photo: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required],
			}),
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
			websiteLink: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.pattern(/^https?:\/\/.+/i)],
			}),
			githubLink: new FormControl('', {
				nonNullable: true,
				validators: [Validators.required, Validators.pattern(/^https?:\/\/.+/i)],
			}),
			team: new FormControl<number[]>([], {
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
		control.markAsDirty();
		control.markAsTouched();
		control.updateValueAndValidity();
	}

	private _buildPayload(form: FormGroup<ProjectFormModel>): ProjectData {
		const tags = form.controls.tags.value;

		const payload: ProjectData = {
			photo: form.controls.photo.value,
			title: form.controls.title.value.trim(),
			description: form.controls.description.value.trim(),
			tags,
			websiteLink: form.controls.websiteLink.value.trim(),
			githubLink: form.controls.githubLink.value.trim(),
			team: form.controls.team.value,
			imageKind: this._isDataUrl(form.controls.photo.value) ? 'upload' : 'asset',
		};

		return payload;
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
		this._readAsDataUrl(file)
			.then((rawDataUrl) => this._compressImageDataUrl(rawDataUrl, file.type))
			.catch(() => this._readAsDataUrl(file))
			.then((result) => {
				if (this._dataUrlByteSize(result) > 500_000) {
					this.apiError.set(
						'Зображення занадто велике. Оберіть менше або стисніть файл перед завантаженням.',
					);
					return;
				}

				control.setValue(result);
				control.markAsDirty();
				control.markAsTouched();
				control.updateValueAndValidity();
				this.apiError.set('');
			});
	}

	private _isDataUrl(value: string): boolean {
		return value.startsWith('data:image/');
	}

	private _readAsDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(typeof reader.result === 'string' ? reader.result : '');
			};
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(file);
		});
	}

	private _compressImageDataUrl(dataUrl: string, fileType: string): Promise<string> {
		if (!dataUrl.startsWith('data:image/')) {
			return Promise.resolve(dataUrl);
		}

		if (fileType === 'image/gif' || fileType === 'image/svg+xml') {
			return Promise.resolve(dataUrl);
		}

		return new Promise((resolve) => {
			const image = new Image();
			image.onload = () => {
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				if (!context) {
					resolve(dataUrl);
					return;
				}

				const targetType = fileType === 'image/webp' ? 'image/webp' : 'image/jpeg';
			const targetBytes = 250_000;
				let maxSide = 1400;
				let quality = 0.82;
				let output = dataUrl;

				for (let attempt = 0; attempt < 7; attempt++) {
					const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
					const width = Math.max(1, Math.round(image.width * scale));
					const height = Math.max(1, Math.round(image.height * scale));

					canvas.width = width;
					canvas.height = height;
					context.clearRect(0, 0, width, height);
					context.drawImage(image, 0, 0, width, height);

					output = canvas.toDataURL(targetType, quality);
					if (this._dataUrlByteSize(output) <= targetBytes) {
						break;
					}

					if (quality > 0.58) {
						quality -= 0.08;
					} else {
						maxSide = Math.max(900, maxSide - 140);
					}
				}

				resolve(output || dataUrl);
			};
			image.onerror = () => resolve(dataUrl);
			image.src = dataUrl;
		});
	}

	private _dataUrlByteSize(dataUrl: string): number {
		const base64 = dataUrl.split(',')[1] || '';
		const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
		return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
	}

	private _loadProjects(): void {
		this._projectService.getAll().subscribe({
			next: (projects) => {
				this.projects.set(Array.isArray(projects) ? projects : []);
				this.apiError.set('');
			},
			error: () => {
				this.projects.set([]);
				this.apiError.set('Не вдалося завантажити список проєктів.');
			},
		});
	}

	private _showToast(message: string): void {
		const id = ++this._toastId;
		this.toasts.update((current) => [...current, { id, message }]);

		setTimeout(() => {
			this.toasts.update((current) => current.filter((toast) => toast.id !== id));
		}, 2000);
	}
}
