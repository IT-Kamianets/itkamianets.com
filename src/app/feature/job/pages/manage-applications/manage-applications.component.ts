import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobProposalService } from '../../job-proposal.service';
import { JobService } from '../../job.service';
import { TableModule as Table } from 'primeng/table';
import { ButtonModule as Button } from 'primeng/button';
import { TagModule as Tag } from 'primeng/tag';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


@Component({
	selector: 'app-manage-applications',
	standalone: true,
	imports: [CommonModule, RouterLink, Table, Button, Tag, ConfirmDialog],
	providers: [ConfirmationService],
	templateUrl: './manage-applications.component.html',
	styleUrl: './manage-applications.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageApplicationsComponent {
	private readonly jobProposalService = inject(JobProposalService);
	private readonly jobService = inject(JobService);
	private readonly confirmationService = inject(ConfirmationService);

	protected readonly proposals = computed(() => this.jobProposalService.proposals());
	protected readonly jobs = computed(() => {
		const jobsMap: Record<string, string> = {};
		this.jobService.jobs().forEach(j => {
			if (j._id) {
				jobsMap[j._id] = j.title || 'Без назви';
			}
		});
		return jobsMap;
	});

	protected deleteProposal(proposal: any) {
		this.confirmationService.confirm({
			message: 'Ви впевнені, що хочете видалити цю заявку?',
			header: 'Підтвердження видалення',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Так',
			rejectLabel: 'Ні',
			accept: () => {
				this.jobProposalService.delete(proposal).subscribe({
					next: (success) => {
						if (!success) {
							console.warn('Failed to delete proposal');
						}
					},
					error: (err) => console.error('Delete error:', err)
				});
			}
		});
	}

	protected getJobTitle(jobId: string): string {
		return this.jobs()[jobId] || 'Завантаження...';
	}
}
