import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../feature/job/job.service';
import { Job } from '../../feature/job/job.interface';
import { UserService } from '../../feature/user/user.service';
import { TEAM_MEMBERS } from '../../data/team.data';

@Component({
	selector: 'app-jobs',
	standalone: true,
	imports: [RouterLink, FormsModule],
	templateUrl: './jobs.component.html',
	styleUrl: './jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
	protected readonly jobService = inject(JobService);
	protected readonly userService = inject(UserService);
	protected readonly authors = TEAM_MEMBERS;

	protected readonly jobs = this.jobService.docs;
	protected readonly isAdmin = this.userService.isAdmin;

	protected readonly editingJob = signal<Job | null>(null);

	protected readonly visibleJobs = computed(() => {
		const allJobs = this.jobs();
		if (this.isAdmin()) {
			return allJobs;
		}
		return allJobs.filter((job) => job.published);
	});

	protected create() {
		this.editingJob.set(this.jobService.new() as Job);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	protected edit(job: Job) {
		this.editingJob.set({ ...job });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	protected save() {
		const job = this.editingJob();
		if (!job) return;

		if (job._id) {
			this.jobService.update(job);
		} else {
			this.jobService.create(job);
		}
		this.editingJob.set(null);
	}

	protected delete(job: Job) {
		if (confirm('Ви впевнені, що хочете видалити цю роботу?')) {
			this.jobService.delete(job);
		}
	}

	protected cancel() {
		this.editingJob.set(null);
	}

	protected format(command: string, value: string = '') {
		document.execCommand(command, false, value);
	}

	protected insertCustomImage() {
		const url = prompt('Введіть URL зображення:');
		if (url) {
			this.format('insertImage', url);
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

	protected updateDescription(event: Event) {
		const job = this.editingJob();
		if (!job) return;
		job.description = (event.target as HTMLElement).innerHTML;
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
}
