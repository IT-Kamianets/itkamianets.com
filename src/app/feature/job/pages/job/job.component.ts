import { ChangeDetectionStrategy, Component, inject, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../job.service';
import { JobProposalService } from '../../job-proposal.service';
import { Job } from '../../job.interface';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Dialog } from 'primeng/dialog';
import { Tag } from 'primeng/tag';
import { Message } from 'primeng/message';

@Component({
	selector: 'app-job-detail',
	standalone: true,
	imports: [
		CommonModule, 
		FormsModule, 
		RouterLink,
		Button,
		InputText,
		Textarea,
		Dialog,
		Tag,
		Message
	],
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
		candidateName: '',
		email: '',
		phone: '',
		cvUrl: '',
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
			candidateName: this.proposal.candidateName,
			email: this.proposal.email,
			phone: this.proposal.phone,
			cvUrl: this.proposal.cvUrl,
			message: this.proposal.message,
			jobId: currentJob._id,
			status: 'new'
		}).subscribe({
			next: (result) => {
				this.isSending.set(false);
				if (result) {
					this.isSubmitted.set(true);
					this.isApplying.set(false);
					this.proposal = {
						candidateName: '',
						email: '',
						phone: '',
						cvUrl: '',
						message: ''
					};
				}
			},
			error: (err) => {
				this.isSending.set(false);
				console.error('Apply error:', err);
			}
		});
	}
}
