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
	protected readonly jobs = computed(() => this.jobService.getSignals('', undefined)().map(s => {
		const job = s();
		if (job.data) {
			return { ...job, ...job.data };
		}
		return job;
	}));
	protected readonly authors = TEAM_MEMBERS;

	protected readonly editingJob = signal<Job | null>(null);

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
		const job = this.jobService.new() as Job;
		job.data = this._newJobData();
		this.editingJob.set(job);
		setTimeout(() => {
			if (this.editorContent) this.editorContent.nativeElement.innerHTML = '';
		});
	}

	protected edit(job: Job) {
		const toEdit = { ...job };
		if (!toEdit.data) {
			toEdit.data = {
				title: job.title || '',
				description: job.description || '',
				authorName: job.authorName || '',
				published: !!job.published,
				preview: job.preview || ''
			};
		}
		this.editingJob.set(toEdit);
		setTimeout(() => {
			if (this.editorContent) {
				this.editorContent.nativeElement.innerHTML = toEdit.data.description || toEdit.description || '';
			}
		});
	}

	protected save() {
		const job = this.editingJob();
		if (!job) return;

		if (this.editorContent) {
			const html = this.editorContent.nativeElement.innerHTML;
			if (job.data) job.data.description = html;
			job.description = html;
		}

		if (job.data) {
			job.title = job.data.title;
			job.authorName = job.data.authorName;
			job.published = job.data.published;
			job.preview = job.data.preview;
		}

		const obs = job._id ? this.jobService.update(job) : this.jobService.create(job);
		
		obs.subscribe(() => {
			this.editingJob.set(null);
		});
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
		if (this.editorContent) {
			this.editorContent.nativeElement.focus();
		}
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
				if (job && job.data) {
					job.data.preview = e.target?.result as string;
					job.preview = job.data.preview;
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
