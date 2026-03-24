import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../job.service';
import { Job, JobData } from '../../job.interface';
import { TEAM_MEMBERS } from '../../../../data/team.data';

@Component({
	selector: 'app-manage-jobs',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
	templateUrl: './jobs.component.html',
	styleUrl: './jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
	@ViewChild('editorContent') editorContent!: ElementRef;

	protected readonly jobService = inject(JobService);
	protected readonly jobs = computed(() => this.jobService.jobs());
	protected readonly authors = TEAM_MEMBERS;

	protected readonly editingJob = signal<Job | null>(null);
	protected readonly isSaving = signal(false);

	private _newJobData(): JobData {
		return {
			title: '',
			description: '',
			authorName: '',
			published: false,
			preview: ''
		};
	}

	protected create() {
		const job = { data: this._newJobData() } as Job;
		this.editingJob.set(job);
		setTimeout(() => {
			if (this.editorContent) this.editorContent.nativeElement.innerHTML = '';
		});
	}

	protected edit(job: Job) {
		const toEdit = JSON.parse(JSON.stringify(job));
		this.editingJob.set(toEdit);
		setTimeout(() => {
			if (this.editorContent) {
				this.editorContent.nativeElement.innerHTML = toEdit.data?.description || '';
			}
		});
	}

	protected save() {
		const job = this.editingJob();
		if (!job || this.isSaving()) return;

		this.isSaving.set(true);

		if (this.editorContent) {
			job.data.description = this.editorContent.nativeElement.innerHTML;
		}

		const obs = job._id ? this.jobService.update(job) : this.jobService.create(job);
		
		obs.subscribe({
			next: () => {
				this.isSaving.set(false);
				this.editingJob.set(null);
			},
			error: (err) => {
				console.error('Save error:', err);
				this.isSaving.set(false);
				alert('Помилка при збереженні');
			}
		});
	}

	protected delete(job: Job) {
		if (confirm('Ви впевнені?')) {
			this.jobService.delete(job).subscribe();
		}
	}

	protected cancel() {
		this.editingJob.set(null);
	}

	protected format(command: string, value: string = '') {
		document.execCommand(command, false, value);
		if (this.editorContent) this.editorContent.nativeElement.focus();
	}

	protected insertCustomImage() {
		const url = prompt('URL:');
		if (url) this.format('insertImage', url);
	}

	protected onImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const job = this.editingJob();
				if (job) job.data.preview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
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
}
