import { ChangeDetectionStrategy, Component, inject, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../job.service';
import { JobProposalService } from '../../job-proposal.service';
import { Job } from '../../job.interface';

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
	protected readonly isSending = signal(false);

	protected proposal = {
		applicantName: '',
		applicantEmail: '',
		applicantPhone: '',
		message: ''
	};

	ngOnInit() {
		if (this.id) {
			this.jobService.fetch(this.id).subscribe({
				next: (job) => this.job.set(job),
				error: (err) => console.error('Error fetching job:', err)
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
		if (!currentJob?._id || this.isSending()) return;

		this.isSending.set(true);

		this.jobProposalService.create({
			jobId: currentJob._id,
			data: { ...this.proposal }
		}).subscribe({
			next: () => {
				this.isSending.set(false);
				this.isSubmitted.set(true);
				this.isApplying.set(false);
				this.proposal = {
					applicantName: '',
					applicantEmail: '',
					applicantPhone: '',
					message: ''
				};
			},
			error: (err) => {
				this.isSending.set(false);
				console.error('Apply error:', err);
				alert('Помилка при відправці заявки');
			}
		});
	}
}
