import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobProposalService } from '../../job-proposal.service';
import { JobService } from '../../job.service';

@Component({
	selector: 'app-manage-applications',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './manage-applications.component.html',
	styleUrl: './manage-applications.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageApplicationsComponent {
	private readonly jobProposalService = inject(JobProposalService);
	private readonly jobService = inject(JobService);

	protected readonly proposals = computed(() => this.jobProposalService.proposals());
	protected readonly jobs = computed(() => {
		const jobsMap: Record<string, string> = {};
		this.jobService.jobs().forEach(j => {
			if (j._id) {
				jobsMap[j._id] = j.data?.title || 'Без назви';
			}
		});
		return jobsMap;
	});

	protected deleteProposal(proposal: any) {
		if (confirm('Ви впевнені?')) {
			this.jobProposalService.delete(proposal).subscribe();
		}
	}

	protected getJobTitle(jobId: string): string {
		return this.jobs()[jobId] || 'Завантаження...';
	}
}
