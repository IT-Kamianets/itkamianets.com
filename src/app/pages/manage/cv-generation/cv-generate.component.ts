import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CvPdfService, CvPayload } from './cv-pdf.service';

type PreviewState = 'idle' | 'generating' | 'done';
type ViewMode = 'form' | 'preview';

@Component({
	selector: 'app-cv-generate',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './cv-generate.component.html',
	styleUrl: './cv-generate.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvGenerateComponent implements OnDestroy {
	private readonly _fb = inject(FormBuilder);
	private readonly _pdfService = inject(CvPdfService);
	private readonly _sanitizer = inject(DomSanitizer);
	private _previewObjectUrl: string | null = null;

	protected readonly state = signal<PreviewState>('idle');
	protected readonly viewMode = signal<ViewMode>('form');
	protected readonly safePdfUrl = signal<SafeResourceUrl | null>(null);
	protected readonly pdfBlob = signal<Blob | null>(null);
	protected readonly errorMessage = signal('');
	protected readonly selectedImageName = signal('Файл не обрано');
	protected readonly submitted = signal(false);
	private readonly _generatedSignature = signal<string | null>(null);

	protected readonly canDownload = computed(() => this.state() === 'done' && !!this.pdfBlob());
	protected readonly canViewPreview = computed(() => this.state() === 'done' && !!this.safePdfUrl());
	protected readonly canReturnToForm = computed(() => this.viewMode() === 'preview');

	protected canGenerate(): boolean {
		if (this.form.invalid || this.state() === 'generating') {
			return false;
		}

		const currentSignature = this._buildSignature(this.form.getRawValue());
		const generatedSignature = this._generatedSignature();
		if (!generatedSignature) {
			return true;
		}

		return currentSignature !== generatedSignature;
	}

	ngOnDestroy(): void {
		this._clearPreviewObjectUrl();
	}

	protected readonly form = this._fb.group({
		fullName: this._fb.control('', { nonNullable: true, validators: [Validators.required, this._fullNameValidator()] }),
		age: this._fb.control('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
		role: this._fb.control('', { nonNullable: true, validators: [Validators.required] }),
		phone: this._fb.control('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[+\d]+$/)] }),
		email: this._fb.control('', {
			nonNullable: true,
			validators: [Validators.required, Validators.email],
		}),
		githubUrl: this._fb.control('', {
			nonNullable: true,
			validators: [Validators.required, Validators.pattern(/^https:\/\/.+/)],
		}),
		linkedinUrl: this._fb.control('', {
			nonNullable: true,
			validators: [Validators.required, Validators.pattern(/^https:\/\/.+/)],
		}),
		about: this._fb.control('', { nonNullable: true, validators: [Validators.required] }),
		professionalActivity: this._fb.control('', { nonNullable: true }),
		hardSkills: this._fb.control('', {
			nonNullable: true,
			validators: [Validators.required, this._commaSeparatedListValidator(20)],
		}),
		softSkills: this._fb.control('', {
			nonNullable: true,
			validators: [Validators.required, this._commaSeparatedListValidator(20)],
		}),
		imageBase64: this._fb.control('', { nonNullable: true, validators: [Validators.required] }),
	});

	protected onImageSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			return;
		}

		this.selectedImageName.set(file.name);
		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === 'string' ? reader.result : '';
			this.form.controls.imageBase64.setValue(result);
			this.form.markAsDirty();
			this.form.controls.imageBase64.markAsDirty();
			this.form.controls.imageBase64.markAsTouched();
			this.form.controls.imageBase64.updateValueAndValidity();
		};
		reader.readAsDataURL(file);
	}

	protected canClear(): boolean {
		if (this.form.dirty) {
			return true;
		}

		const raw = this.form.getRawValue();
		const { imageBase64, ...otherValues } = raw as { imageBase64?: unknown; [key: string]: unknown };
		return Object.values(otherValues).some((value) => Boolean(String(value).trim()));
	}

	protected showError(control: AbstractControl | null): boolean {
		return !!control && control.invalid && (control.dirty || control.touched || this.submitted());
	}

	protected controlError(control: AbstractControl | null, label: string): string {
		if (!control || !this.showError(control)) {
			return '';
		}

		if (control.hasError('required')) {
			return `${label} є обов'язковим полем.`;
		}

		if (control.hasError('email')) {
			return 'Вкажіть коректний email (наприклад name@example.com).';
		}

		if (control.hasError('fullNameFormat')) {
			return 'Вкажіть прізвище та ім\'я через пробіл (наприклад: Шевченко Тарас).';
		}

		if (control.hasError('pattern')) {
			if (label === 'Вік') {
				return 'У полі Вік дозволені лише цифри.';
			}

			if (label === 'Номер телефону') {
				return 'У полі Номер телефону дозволені лише цифри та символ +.';
			}

			if (label === 'Посилання на GitHub' || label === 'Посилання на LinkedIn') {
				return 'Посилання має починатися з https://';
			}
		}

		if (control.hasError('commaList')) {
			return `${label} потрібно вказати списком через кому.`;
		}

		if (control.hasError('commaListMax')) {
			return `У полі ${label} дозволено не більше 20 елементів.`;
		}

		return 'Перевірте коректність введених даних.';
	}

	protected clear(): void {
		this.form.reset({
			fullName: '',
			age: '',
			role: '',
			phone: '',
			email: '',
			githubUrl: '',
			linkedinUrl: '',
			about: '',
			professionalActivity: '',
			hardSkills: '',
			softSkills: '',
			imageBase64: '',
		});

		this.form.markAsPristine();
		this.form.markAsUntouched();
		this._clearPreviewObjectUrl();
		this.safePdfUrl.set(null);
		this.pdfBlob.set(null);
		this.state.set('idle');
		this.viewMode.set('form');
		this._generatedSignature.set(null);
		this.errorMessage.set('');
		this.selectedImageName.set('Файл не обрано');
		this.submitted.set(false);
	}

	protected async generateCv(): Promise<void> {
		this.submitted.set(true);
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			this.errorMessage.set('Заповніть обов\'язкові поля та виправте помилки форми.');
			return;
		}

		this.viewMode.set('preview');
		this.state.set('generating');
		this.errorMessage.set('');
		const startedAt = Date.now();

		try {
			const payload = this._buildPayload();
			const signature = this._buildSignature(this.form.getRawValue());
			const blob = await this._pdfService.generatePdfBlob(payload);

			const elapsed = Date.now() - startedAt;
			if (elapsed < 2000) {
				await this._delay(2000 - elapsed);
			}

			const objectUrl = URL.createObjectURL(blob);
			const viewerUrl = `${objectUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=65`;
			this._clearPreviewObjectUrl();
			this._previewObjectUrl = objectUrl;
			this.safePdfUrl.set(this._sanitizer.bypassSecurityTrustResourceUrl(viewerUrl));
			this.pdfBlob.set(blob);
			this.state.set('done');
			this._generatedSignature.set(signature);
		} catch {
			this._clearPreviewObjectUrl();
			this.safePdfUrl.set(null);
			this.pdfBlob.set(null);
			this.state.set('idle');
			this.viewMode.set('form');
			this.errorMessage.set('Не вдалося згенерувати CV. Спробуйте ще раз.');
		}
	}

	protected goToForm(): void {
		if (!this.canReturnToForm()) {
			return;
		}

		this.viewMode.set('form');
	}

	protected goToPreview(): void {
		if (!this.canViewPreview() || this.viewMode() === 'preview') {
			return;
		}

		this.viewMode.set('preview');
	}

	protected async download(): Promise<void> {
		if (!this.canDownload()) {
			return;
		}

		try {
			await this._pdfService.download(this._buildPayload(), this._buildFileName());
		} catch {
			this.errorMessage.set('Не вдалося завантажити CV.');
		}
	}

	protected async share(): Promise<void> {
		if (!this.canDownload()) {
			return;
		}

		this.errorMessage.set('');

		try {
			const file = await this._pdfService.toFile(this._buildPayload(), this._buildFileName());
			if (!navigator.share || !navigator.canShare || !navigator.canShare({ files: [file] })) {
				this.errorMessage.set('Ваш браузер не підтримує поділитися файлом.');
				return;
			}

			await navigator.share({
				title: 'CV',
				text: 'Моє згенероване CV',
				files: [file],
			});
		} catch {
			this.errorMessage.set('Не вдалося поділитися файлом.');
		}
	}

	private _buildPayload(): CvPayload {
		const raw = this.form.getRawValue();
		const hardSkills = this._parseCommaList(raw.hardSkills);
		const softSkills = this._parseCommaList(raw.softSkills);
		const professionalActivity = raw.professionalActivity.trim();

		return {
			fullName: raw.fullName.trim(),
			age: raw.age.trim(),
			role: raw.role.trim(),
			phone: raw.phone.trim(),
			email: raw.email.trim(),
			githubUrl: raw.githubUrl.trim(),
			linkedinUrl: raw.linkedinUrl.trim(),
			about: raw.about.trim(),
			professionalActivity: professionalActivity || null,
			hardSkills,
			softSkills,
			imageBase64: raw.imageBase64,
		};
	}

	private _buildFileName(): string {
		const fullName = this.form.controls.fullName.value.trim();
		const normalized = fullName ? fullName.replace(/\s+/g, '_') : 'CV_User';
		return `${normalized}_CV.pdf`;
	}

	private _parseCommaList(value: string): string[] {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	private _buildSignature(raw: ReturnType<typeof this.form.getRawValue>): string {
		const normalized = {
			fullName: raw.fullName.trim(),
			age: raw.age.trim(),
			role: raw.role.trim(),
			phone: raw.phone.trim(),
			email: raw.email.trim().toLowerCase(),
			githubUrl: raw.githubUrl.trim(),
			linkedinUrl: raw.linkedinUrl.trim(),
			about: raw.about.trim(),
			professionalActivity: raw.professionalActivity.trim(),
			hardSkills: this._parseCommaList(raw.hardSkills).join('|'),
			softSkills: this._parseCommaList(raw.softSkills).join('|'),
			imageBase64: raw.imageBase64,
		};

		return JSON.stringify(normalized);
	}

	private _fullNameValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = String(control.value ?? '').trim();
			if (!value) {
				return null;
			}

			const parts = value.split(/\s+/).filter(Boolean);
			return parts.length >= 2 ? null : { fullNameFormat: true };
		};
	}

	private _commaSeparatedListValidator(maxItems: number): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = String(control.value ?? '').trim();
			if (!value) {
				return null;
			}

			const items = this._parseCommaList(value);
			if (items.length === 0) {
				return { commaList: true };
			}

			if (items.length > maxItems) {
				return { commaListMax: true };
			}

			return null;
		};
	}

	private _clearPreviewObjectUrl(): void {
		if (this._previewObjectUrl) {
			URL.revokeObjectURL(this._previewObjectUrl);
			this._previewObjectUrl = null;
		}
	}

	private _delay(ms: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
}
