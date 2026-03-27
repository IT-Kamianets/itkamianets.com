import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../job.service';
import { Job, JobData } from '../../job.interface';
import { TableModule as Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Textarea } from 'primeng/textarea';
import { Tag } from 'primeng/tag';

@Component({
	selector: 'app-manage-jobs',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterLink,
		Table,
		Dialog,
		Button,
		InputText,
		Textarea,
		ConfirmDialog,
		Tag
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

	private _newJobData(): JobData {
		return {
			title: '',
			description: '',
			company: '',
			requirements: [],
			status: 'active',
			preview: ''
		};
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
						data: { ...job.data, preview: e.target?.result as string }
					});
				}
			};
			reader.readAsDataURL(file);
		}
	}

	protected create() {
		this.selectedJob.set({ data: this._newJobData() } as Job);
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
			next: () => {
				this.isSaving.set(false);
				this.displayDialog.set(false);
				this.selectedJob.set(null);
				this.jobService.load(); // Примусове перезавантаження для впевненості
			},
			error: (err) => {
				console.error('Save error:', err);
				this.isSaving.set(false);
			}
		});
	}

	protected delete(job: Job) {
		this.confirmationService.confirm({
			message: 'Ви впевнені, що хочете видалити цю вакансію?',
			header: 'Підтвердження видалення',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Так',
			rejectLabel: 'Ні',
			accept: () => {
				this.jobService.delete(job).subscribe();
			}
		});
	}

	protected getRequirementString(job: Job): string {
		return job.data?.requirements?.join(', ') || '';
	}

	protected setRequirements(value: string) {
		const job = this.selectedJob();
		if (job) {
			job.data.requirements = value.split(',').map(s => s.trim()).filter(s => !!s);
		}
	}
}
