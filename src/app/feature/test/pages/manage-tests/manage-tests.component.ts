import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	FormArray,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../user/user.service';
import { Question, Test, TestData } from '../../test.interface';
import { TestService } from '../../test.service';

interface TestQuestionForm {
	question: FormControl<string>;
	options: FormArray<FormControl<string>>;
	correct: FormControl<number>;
}

interface TestFormModel {
	title: FormControl<string>;
	description: FormControl<string>;
	questions: FormArray<FormGroup<TestQuestionForm>>;
}

interface ToastItem {
	id: number;
	message: string;
}

const minArrayLength = (min: number): ValidatorFn => {
	return (control): ValidationErrors | null => {
		const value = control.value;

		return Array.isArray(value) && value.length >= min ? null : { minArrayLength: true };
	};
};

const trimRequired: ValidatorFn = (control): ValidationErrors | null => {
	const value = control.value;

	return typeof value === 'string' && value.trim() ? null : { trimRequired: true };
};

const minFilledOptions = (min: number): ValidatorFn => {
	return (control): ValidationErrors | null => {
		const value = control.value;
		if (!Array.isArray(value)) {
			return { minFilledOptions: true };
		}

		const filledCount = value.filter(
			(option) => typeof option === 'string' && option.trim(),
		).length;

		return filledCount >= min ? null : { minFilledOptions: true };
	};
};

const correctOptionFilled: ValidatorFn = (control): ValidationErrors | null => {
	const group = control as FormGroup<TestQuestionForm>;
	const correct = group.controls.correct.value;
	const option = group.controls.options.at(correct)?.value || '';

	return option.trim() ? null : { correctOptionMissing: true };
};

@Component({
	selector: 'app-manage-tests',
	templateUrl: './manage-tests.component.html',
	styleUrl: './manage-tests.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TableModule,
		DialogModule,
		InputTextModule,
		ButtonModule,
	],
})
export class ManageTestsComponent {
	private readonly _testService = inject(TestService);
	private readonly _userService = inject(UserService);
	private readonly _cdr = inject(ChangeDetectorRef);
	private readonly _destroyRef = inject(DestroyRef);
	private _toastId = 0;

	protected readonly tests = signal<Test[]>([]);
	protected readonly validationVersion = signal(0);
	protected readonly isDialogOpen = signal(false);
	protected readonly isPreviewOpen = signal(false);
	protected readonly deleteCandidate = signal<Test | null>(null);
	protected readonly editTestId = signal<string | null>(null);
	protected readonly submitted = signal(false);
	protected readonly apiError = signal('');
	protected readonly previewTest = signal<Test | null>(null);
	protected readonly toasts = signal<ToastItem[]>([]);
	protected readonly form = this._createForm();

	protected get questionControls(): FormArray<FormGroup<TestQuestionForm>> {
		return this.form.controls.questions;
	}

	constructor(title: Title, meta: Meta) {
		title.setTitle('Управління тестами | IT-Kamianets');
		meta.updateTag({
			name: 'description',
			content: 'Адмін панель для управління тестами.',
		});
		this.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
			this.validationVersion.update((version) => version + 1);
			this._cdr.markForCheck();
		});
		this._loadTests();
	}

	protected openCreateDialog(): void {
		this._resetForm();
		this.editTestId.set(null);
		this.apiError.set('');
		this.submitted.set(false);
		this.isDialogOpen.set(true);
	}

	protected openEdit(test: Test): void {
		this._fillForm(test.data);
		this.editTestId.set(test._id || null);
		this.apiError.set('');
		this.submitted.set(false);
		this.isDialogOpen.set(true);
	}

	protected closeDialog(): void {
		this.isDialogOpen.set(false);
		this.editTestId.set(null);
		this.submitted.set(false);
	}

	protected onDialogVisibleChange(visible: boolean): void {
		this.isDialogOpen.set(visible);
		if (!visible) {
			this.editTestId.set(null);
			this.submitted.set(false);
		}
	}

	protected optionControls(questionIndex: number): FormArray<FormControl<string>> {
		return this.questionControls.at(questionIndex).controls.options;
	}

	protected isQuestionTextInvalid(questionIndex: number): boolean {
		this.validationVersion();
		return !this.questionControls.at(questionIndex).controls.question.value.trim();
	}

	protected areOptionsInvalid(questionIndex: number): boolean {
		this.validationVersion();
		const filledCount = this.optionControls(questionIndex).controls.filter((option) =>
			option.value.trim(),
		).length;

		return filledCount < 2;
	}

	protected isCorrectOptionInvalid(questionIndex: number): boolean {
		this.validationVersion();
		const question = this.questionControls.at(questionIndex);
		const correct = question.controls.correct.value;

		return !question.controls.options.at(correct)?.value.trim();
	}

	protected addQuestion(): void {
		this.questionControls.push(this._createQuestionForm());
		this.questionControls.markAsDirty();
	}

	protected removeQuestion(index: number): void {
		if (this.questionControls.length <= 1) {
			return;
		}

		this.questionControls.removeAt(index);
		this.questionControls.markAsDirty();
	}

	protected addOption(questionIndex: number): void {
		const options = this.optionControls(questionIndex);
		options.push(this._createOptionControl());
		options.markAsDirty();
	}

	protected removeOption(questionIndex: number, optionIndex: number): void {
		const question = this.questionControls.at(questionIndex);
		const options = question.controls.options;
		if (options.length <= 2) {
			return;
		}

		options.removeAt(optionIndex);
		const correct = question.controls.correct.value;
		if (correct >= options.length) {
			question.controls.correct.setValue(options.length - 1);
		} else if (correct === optionIndex) {
			question.controls.correct.setValue(0);
		}
		options.markAsDirty();
	}

	protected setCorrectOption(questionIndex: number, optionIndex: number): void {
		const control = this.questionControls.at(questionIndex).controls.correct;
		control.setValue(optionIndex);
		control.markAsDirty();
		control.markAsTouched();
	}

	protected openDraftPreview(): void {
		this.submitted.set(true);
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.previewTest.set({
			_id: this.editTestId() || 'preview',
			data: this._buildPayload(),
		});
		this.isPreviewOpen.set(true);
	}

	protected closePreview(): void {
		this.isPreviewOpen.set(false);
		this.previewTest.set(null);
	}

	protected saveTest(): void {
		this.submitted.set(true);
		this.apiError.set('');

		if (!this._userService.user().token?.trim()) {
			this.apiError.set(
				'Не вдалося зберегти тест: сесія не має API token. Вийдіть і увійдіть знову.',
			);
			return;
		}

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const payload = this._buildPayload();
		const id = this.editTestId();
		const request = id
			? this._testService.update(id, payload)
			: this._testService.create(payload);

		request.subscribe({
			next: (saved) => {
				if (!saved) {
					this.apiError.set(
						'Не вдалося зберегти тест: API повернув false. Перевірте права доступу для цього акаунта.',
					);
					return;
				}

				this.closeDialog();
				this._loadTests();
				this._showToast(id ? 'Тест успішно оновлено!' : 'Тест успішно створено!');
			},
			error: () => {
				this.apiError.set('Не вдалося зберегти тест: помилка запиту до API.');
			},
		});
	}

	protected askDelete(test: Test): void {
		this.deleteCandidate.set(test);
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
		this._testService.delete(candidate._id).subscribe({
			next: (deleted) => {
				if (!deleted) {
					this.apiError.set('Не вдалося видалити тест. Спробуйте ще раз.');
					return;
				}

				this.deleteCandidate.set(null);
				this._loadTests();
				this._showToast('Тест успішно видалено!');
			},
			error: () => {
				this.apiError.set('Не вдалося видалити тест. Спробуйте пізніше.');
			},
		});
	}

	protected trackByTestId(index: number, test: Test): string {
		return test._id || String(index);
	}

	private _createForm(): FormGroup<TestFormModel> {
		return new FormGroup<TestFormModel>({
			title: new FormControl('', {
				nonNullable: true,
				validators: [trimRequired, Validators.minLength(2)],
			}),
			description: new FormControl('', {
				nonNullable: true,
				validators: [trimRequired, Validators.minLength(10)],
			}),
			questions: new FormArray<FormGroup<TestQuestionForm>>([this._createQuestionForm()], {
				validators: [Validators.required, minArrayLength(1)],
			}),
		});
	}

	private _createQuestionForm(question?: Question): FormGroup<TestQuestionForm> {
		const options = question?.options?.length ? question.options : ['', '', '', ''];

		return new FormGroup<TestQuestionForm>(
			{
				question: new FormControl(question?.question || '', {
					nonNullable: true,
					validators: [trimRequired],
				}),
				options: new FormArray<FormControl<string>>(
					options.map((option) => this._createOptionControl(option)),
					{ validators: [minArrayLength(2), minFilledOptions(2)] },
				),
				correct: new FormControl(question?.correct || 0, {
					nonNullable: true,
					validators: [Validators.required],
				}),
			},
			{ validators: [correctOptionFilled] },
		);
	}

	private _createOptionControl(value = ''): FormControl<string> {
		return new FormControl(value, {
			nonNullable: true,
		});
	}

	private _fillForm(data: TestData): void {
		this.form.controls.title.setValue(data.title || '');
		this.form.controls.description.setValue(data.description || '');
		this.questionControls.clear();

		const questions = data.questions?.length
			? data.questions
			: [{ question: '', options: ['', ''], correct: 0 }];
		questions.forEach((question) =>
			this.questionControls.push(this._createQuestionForm(question)),
		);

		this.form.markAsPristine();
		this.form.markAsUntouched();
	}

	private _resetForm(): void {
		this.form.reset({
			title: '',
			description: '',
		});
		this.questionControls.clear();
		this.questionControls.push(this._createQuestionForm());
		this.form.markAsPristine();
		this.form.markAsUntouched();
	}

	private _buildPayload(): TestData {
		return {
			title: this.form.controls.title.value.trim(),
			description: this.form.controls.description.value.trim(),
			questions: this.questionControls.controls.map((question) => ({
				question: question.controls.question.value.trim(),
				options: question.controls.options.controls
					.map((option) => option.value.trim())
					.filter((option) => Boolean(option)),
				correct: this._normalizeCorrectIndex(question),
			})),
		};
	}

	private _normalizeCorrectIndex(question: FormGroup<TestQuestionForm>): number {
		const correctValue = question.controls.correct.value;
		const originalOptions = question.controls.options.controls.map((option) =>
			option.value.trim(),
		);
		const correctOption = originalOptions[correctValue];
		const filledOptions = originalOptions.filter((option) => Boolean(option));

		return Math.max(
			0,
			filledOptions.findIndex((option) => option === correctOption),
		);
	}

	private _loadTests(): void {
		this._testService.getAll().subscribe({
			next: (tests) => {
				this.tests.set(Array.isArray(tests) ? tests : []);
				this.apiError.set('');
			},
			error: () => {
				this.tests.set([]);
				this.apiError.set('Не вдалося завантажити список тестів.');
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
