import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Job } from '../../feature/job/job.interface';
import { JobService } from '../../feature/job/job.service';

@Component({
	selector: 'app-jobs',
	templateUrl: './jobs.component.html',
	styleUrl: './jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
	protected readonly jobService = inject(JobService);
	protected readonly jobs = this.jobService.docs;

	protected readonly publishedJobs = computed(() => {
		return this.jobs().filter((job: Job) => job.published);
	});
}
