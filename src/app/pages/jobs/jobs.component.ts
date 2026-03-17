import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobService } from '../../feature/job/job.service';
import { Job } from '../../feature/job/job.interface';

@Component({
	selector: 'app-jobs',
	standalone: true,
	imports: [RouterLink],
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
