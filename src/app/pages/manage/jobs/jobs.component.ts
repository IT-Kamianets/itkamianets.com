import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, ElementRef, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../feature/job/job.service';
import { Job } from '../../../feature/job/job.interface';
import { TEAM_MEMBERS } from '../../../data/team.data';

@Component({
	selector: 'app-manage-jobs',
	standalone: true,
	imports: [FormsModule, RouterLink],
	templateUrl: './jobs.component.html',
	styleUrl: './jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
	@ViewChild('editorContent') editorContent!: ElementRef;

	protected readonly jobService = inject(JobService);
	protected readonly jobs = this.jobService.docs;
	protected readonly authors = TEAM_MEMBERS;

	constructor() {
		effect(() => {
			console.log('Component received jobs:', this.jobs());
		});
	}

	protected readonly editingJob = signal<Job | null>(null);

	protected create() {
		this.editingJob.set(this.jobService.new() as Job);
		setTimeout(() => {
			if (this.editorContent) this.editorContent.nativeElement.innerHTML = '';
		});
	}

	protected edit(job: Job) {
		this.editingJob.set({ ...job });
		setTimeout(() => {
			if (this.editorContent) this.editorContent.nativeElement.innerHTML = job.description || '';
		});
	}

	protected save() {
		const job = this.editingJob();
		if (!job) return;

		// Отримуємо вміст безпосередньо з DOM перед збереженням
		job.description = this.editorContent.nativeElement.innerHTML;

		if (job._id) {
			this.jobService.update(job).subscribe(() => {
				this.editingJob.set(null);
			});
		} else {
			this.jobService.create(job).subscribe(() => {
				this.editingJob.set(null);
			});
		}
	}

	protected delete(job: Job) {
		if (confirm('Ви впевнені, що хочете видалити цю роботу?')) {
			this.jobService.delete(job).subscribe();
		}
	}

	protected cancel() {
		this.editingJob.set(null);
	}

	protected format(command: string, value: string = '') {
		document.execCommand(command, false, value);
		this.editorContent.nativeElement.focus();
	}

	protected insertCustomImage() {
		const url = prompt('Введіть URL зображення:');
		if (url) {
			this.format('insertImage', url);
		}
	}

	protected onImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const job = this.editingJob();
				if (job) {
					job.preview = e.target?.result as string;
				}
			};
			reader.readAsDataURL(file);
		}
	}

	protected uploadPostImage(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const url = e.target?.result as string;
				this.format('insertImage', url);
			};
			reader.readAsDataURL(file);
		}
	}
}
