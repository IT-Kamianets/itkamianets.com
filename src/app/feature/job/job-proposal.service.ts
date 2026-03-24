import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JobProposal } from './job-proposal.interface';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobProposalService {
	private http = inject(HttpClient);
	private API = `${environment.apiUrl}/api/itjobproposal`;

	readonly proposals = signal<JobProposal[]>([]);

	constructor() {
		this.load();
	}

	load(): void {
		this.http.get<any[]>(`${this.API}/get`).subscribe({
			next: (docs) => {
				if (Array.isArray(docs)) {
					this.proposals.set(docs.map(d => this._fromDoc(d)));
				}
			}
		});
	}

	create(proposal: Partial<JobProposal>): Observable<any> {
		return this.http.post<any>(`${this.API}/create`, { jobId: proposal.jobId, data: proposal.data }).pipe(
			tap(doc => {
				if (doc?._id) {
					this.proposals.update(list => [this._fromDoc(doc), ...list]);
				}
			})
		);
	}

	delete(proposal: JobProposal): Observable<any> {
		return this.http.post<any>(`${this.API}/delete`, { _id: proposal._id }).pipe(
			tap(() => {
				this.proposals.update(list => list.filter(item => item._id !== proposal._id));
			})
		);
	}

	private _fromDoc(doc: any): JobProposal {
		return {
			_id: doc._id,
			jobId: doc.jobId,
			data: doc.data || {
				applicantName: doc.applicantName || '',
				applicantEmail: doc.applicantEmail || '',
				applicantPhone: doc.applicantPhone || '',
				message: doc.message || ''
			}
		} as JobProposal;
	}
}
