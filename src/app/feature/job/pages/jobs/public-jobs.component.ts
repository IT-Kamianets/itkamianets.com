import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Job } from '../../job.interface';
import { JobService } from '../../job.service';

@Component({
	selector: 'app-public-jobs',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './public-jobs.component.html',
	styleUrl: './public-jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicJobsComponent {
	protected readonly jobService = inject(JobService);
	protected readonly jobs = computed(() => this.jobService.jobs());

	protected readonly activeJobs = computed(() => {
		return this.jobs().filter((job: Job) => job.status === 'active');
	});
}
