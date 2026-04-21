import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../job.service';
import { Job } from '../../job.interface';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'app-manage-jobs',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterLink,
		TableModule,
		DialogModule,
		ButtonModule,
		InputTextModule,
		TextareaModule,
		ConfirmDialogModule,
		TagModule,
		TooltipModule
	],
	providers: [ConfirmationService],
	templateUrl: './jobs.component.html',
	styleUrl: './jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
	protected readonly jobService = inject(JobService);
	protected readonly confirmationService = inject(ConfirmationService);
	protected readonly jobs = computed(() => this.jobService.jobs());

	protected readonly displayDialog = signal(false);
	protected readonly selectedJob = signal<Job | null>(null);
	protected readonly isSaving = signal(false);

	private _newJobData(): Job {
		return {
			title: '',
			description: '',
			requirements: [],
			status: 'active',
			authorName: '',
			authorId: '',
			published: false,
			preview: '',
			company: ''
		} as Job;
	}

	protected onImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const job = this.selectedJob();
				if (job) {
					// Створюємо новий об'єкт, щоб Angular помітив зміну
					this.selectedJob.set({
						...job,
						preview: e.target?.result as string 
					});
				}
			};
			reader.readAsDataURL(file);
		}
	}

	protected create() {
		this.selectedJob.set(this._newJobData() as Job);
		this.displayDialog.set(true);
	}

	protected edit(job: Job) {
		// Глибоке копіювання, щоб не змінювати оригінал до збереження
		this.selectedJob.set(JSON.parse(JSON.stringify(job)));
		this.displayDialog.set(true);
	}

	protected save() {
		const job = this.selectedJob();
		if (!job || this.isSaving()) return;

		this.isSaving.set(true);
		const obs = job._id ? this.jobService.update(job) : this.jobService.create(job);

		obs.subscribe({
			next: (result) => {
				this.isSaving.set(false);
				if (result) {
					this.displayDialog.set(false);
					this.selectedJob.set(null);
				} else {
					console.warn('Server returned empty result for save');
					this._showError('Не вдалося зберегти вакансію. Переконайтеся, що ви увійшли в систему.');
				}
				this.jobService.load();
			},
			error: (err) => {
				console.error('Save error:', err);
				this.isSaving.set(false);
				if (err.name === 'TimeoutError') {
					this._showError('Сервер не відповідає занадто довго. Спробуйте пізніше або повідомте адміністратора.');
				} else if (err.status === 504) {
					this._showError('Сервер тимчасово не відповідає. Спробуйте через кілька хвилин.');
				} else if (err.status === 0) {
					this._showError('Не вдається підключитися до сервера. Перевірте інтернет-з\'єднання.');
				} else {
					this._showError('Помилка під час збереження. Спробуйте ще раз.');
				}
				this.jobService.load();
			}
		});
	}

	private _showError(message: string) {
		alert(message);
	}

	protected delete(job: Job) {
		this.confirmationService.confirm({
			message: 'Ви впевнені, що хочете видалити цю вакансію?',
			header: 'Підтвердження видалення',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Так',
			rejectLabel: 'Ні',
			accept: () => {
				this.jobService.delete(job).subscribe({
					next: (success) => {
						if (!success) {
							console.warn('Failed to delete job');
						}
					},
					error: (err) => console.error('Delete error:', err)
				});
			}
		});
	}

	protected getRequirementString(job: Job): string {
		return job.requirements?.join(', ') || '';
	}

	protected setRequirements(value: string) {
		const job = this.selectedJob();
		if (job) {
			job.requirements = value.split(',').map(s => s.trim()).filter(s => !!s);
		}
	}
}
