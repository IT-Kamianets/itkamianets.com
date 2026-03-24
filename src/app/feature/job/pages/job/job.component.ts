import { ChangeDetectionStrategy, Component, inject, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../job.service';
import { JobProposalService } from '../../job-proposal.service';
import { Job } from '../../job.interface';
import { JobProposal } from '../../job-proposal.interface';

@Component({
	selector: 'app-job-detail',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
	templateUrl: './job.component.html',
	styleUrl: './job.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobComponent implements OnInit {
	@Input() id!: string;

	private readonly jobService = inject(JobService);
	private readonly jobProposalService = inject(JobProposalService);

	protected readonly job = signal<Job | null>(null);
	protected readonly isApplying = signal(false);
	protected readonly isSubmitted = signal(false);

	protected proposal = {
		applicantName: '',
		applicantEmail: '',
		applicantPhone: '',
		message: ''
	};

	ngOnInit() {
		if (this.id) {
			this.jobService.fetch({ _id: this.id }).subscribe((job) => {
				this.job.set(job);
			});
		}
	}

	protected openApplyModal() {
		this.isApplying.set(true);
	}

	protected closeApplyModal() {
		this.isApplying.set(false);
	}

	protected submitApplication() {
		const currentJob = this.job();
		if (!currentJob?._id) return;

		const newProposal = this.jobProposalService.new() as JobProposal;
		newProposal.jobId = currentJob._id;
		newProposal.data = { ...this.proposal };

		this.jobProposalService.create(newProposal).subscribe(() => {
			this.isSubmitted.set(true);
			this.isApplying.set(false);
			// Reset form
			this.proposal = {
				applicantName: '',
				applicantEmail: '',
				applicantPhone: '',
				message: ''
			};
		});
	}
}
