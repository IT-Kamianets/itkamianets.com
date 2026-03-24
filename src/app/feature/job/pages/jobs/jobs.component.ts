import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Job } from '../../job.interface';
import { JobService } from '../../job.service';

@Component({
	selector: 'app-jobs',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './jobs.component.html',
	styleUrl: './jobs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
	protected readonly jobService = inject(JobService);
	protected readonly jobs = computed(() => this.jobService.getSignals('', undefined)().map(s => s()));

	protected readonly publishedJobs = computed(() => {
		return this.jobs().filter((job: Job) => job.data?.published || job.published);
	});
}
