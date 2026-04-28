import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobProposalService } from '../../job-proposal.service';
import { JobService } from '../../job.service';
import { JobProposal } from '../../job-proposal.interface';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
	selector: 'app-manage-job-proposals',
	standalone: true,
	imports: [
		CommonModule, 
		RouterLink, 
		FormsModule,
		TableModule, 
		ButtonModule, 
		TagModule, 
		ConfirmDialogModule, 
		TooltipModule,
		DialogModule,
		SelectButtonModule
	],
	providers: [ConfirmationService],
	templateUrl: './manage-job-proposals.component.html',
	styleUrl: './manage-job-proposals.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageJobProposalsComponent {
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

	protected readonly displayDetailDialog = signal(false);
	protected readonly selectedProposal = signal<JobProposal | null>(null);

	protected readonly statusOptions = [
		{ label: 'Нова', value: 'new' },
		{ label: 'Розглянута', value: 'reviewed' },
		{ label: 'Відхилена', value: 'rejected' }
	];

	protected viewDetails(proposal: JobProposal) {
		this.selectedProposal.set({ ...proposal });
		this.displayDetailDialog.set(true);
	}

	protected updateStatus(proposal: JobProposal, status: any) {
		const updated = { ...proposal, status };
		this.jobProposalService.update(updated).subscribe();
	}

	protected saveStatus() {
		const proposal = this.selectedProposal();
		if (proposal) {
			this.jobProposalService.update(proposal).subscribe(() => {
				this.displayDetailDialog.set(false);
			});
		}
	}

	protected deleteProposal(proposal: JobProposal) {
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
					error: (err: any) => console.error('Delete error:', err)
				});
			}
		});
	}

	protected getJobTitle(jobId: string): string {
		return this.jobs()[jobId] || 'Завантаження...';
	}

	protected getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
		switch (status) {
			case 'new': return 'info';
			case 'reviewed': return 'success';
			case 'rejected': return 'danger';
			default: return 'secondary';
		}
	}

	protected getStatusLabel(status: string): string {
		switch (status) {
			case 'new': return 'Нова';
			case 'reviewed': return 'Розглянута';
			case 'rejected': return 'Відхилена';
			default: return status;
		}
	}
}
