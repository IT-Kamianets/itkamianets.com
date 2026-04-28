import { ChangeDetectionStrategy, Component, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../job.service';
import { Job, JobData } from '../../job.interface';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';

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
		ConfirmDialogModule,
		TagModule,
		TooltipModule,
		SelectButtonModule
	],
	providers: [ConfirmationService],
	templateUrl: './manage-jobs.component.html',
	styleUrl: './manage-jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageJobsComponent {
	@ViewChild('editorContent') editorContent!: ElementRef;
	
	protected readonly jobService = inject(JobService);
	protected readonly confirmationService = inject(ConfirmationService);
	protected readonly jobs = computed(() => this.jobService.jobs());

	protected readonly displayDialog = signal(false);
	protected readonly selectedJob = signal<Job | null>(null);
	protected readonly isSaving = signal(false);

	protected readonly stateOptions = [
		{ label: 'Активна', value: 'active' },
		{ label: 'Закрита', value: 'closed' }
	];

	private _newJobData(): Job {
		const data: JobData = {
			title: '',
			description: '',
			requirements: [],
			status: 'active',
			preview: '',
			company: '',
			published: true
		};
		return {
			_id: '',
			...data,
			data
		} as Job;
	}

	protected create() {
		this.selectedJob.set(this._newJobData());
		this.displayDialog.set(true);
		setTimeout(() => {
			if (this.editorContent) this.editorContent.nativeElement.innerHTML = '';
		});
	}

	protected edit(job: Job) {
		this.selectedJob.set(JSON.parse(JSON.stringify(job)));
		this.displayDialog.set(true);
		setTimeout(() => {
			if (this.editorContent) this.editorContent.nativeElement.innerHTML = job.description || '';
		});
	}

	protected save() {
		const job = this.selectedJob();
		if (!job || this.isSaving()) return;

		// Get content from the rich text editor
		if (this.editorContent) {
			job.description = this.editorContent.nativeElement.innerHTML;
		}

		job.data = {
			title: job.title,
			description: job.description,
			company: job.company,
			requirements: job.requirements,
			status: job.status,
			preview: job.preview,
			published: job.status === 'active',
			authorName: job.authorName,
			authorId: job.authorId
		};

		this.isSaving.set(true);
		const obs = job._id ? this.jobService.update(job) : this.jobService.create(job);

		obs.subscribe({
			next: (result) => {
				this.isSaving.set(false);
				if (result) {
					this.displayDialog.set(false);
					this.selectedJob.set(null);
				}
				this.jobService.load();
			},
			error: (err) => {
				console.error('Save error:', err);
				this.isSaving.set(false);
				this.jobService.load();
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

	// Editor Commands
	protected format(command: string, value: string = '') {
		document.execCommand(command, false, value);
		if (this.editorContent) this.editorContent.nativeElement.focus();
	}

	protected insertCustomImage() {
		const url = prompt('Введіть URL зображення:');
		if (url) this.format('insertImage', url);
	}

	protected uploadPostImage(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				this.format('insertImage', e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	}

	protected onImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const job = this.selectedJob();
				if (job) {
					this.selectedJob.set({ ...job, preview: e.target?.result as string });
				}
			};
			reader.readAsDataURL(file);
		}
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
