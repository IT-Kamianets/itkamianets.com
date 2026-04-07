import { Injectable, inject, signal } from '@angular/core';
import { JobProposal } from './job-proposal.interface';
import { Observable, tap, map } from 'rxjs';
import { HttpService } from 'wacom';

@Injectable({ providedIn: 'root' })
export class JobProposalService {
	private http = inject(HttpService);
	private API = `/api/itjobproposal`;

	readonly proposals = signal<JobProposal[]>([]);

	constructor() {
		this.load();
	}

	load(): void {
		this.http.get(`${this.API}/get`).subscribe({
			next: (docs: any) => {
				const data = Array.isArray(docs) ? docs : (docs?.data || []);
				if (Array.isArray(data)) {
					this.proposals.set(data.map((d: any) => this._fromDoc(d)));
				}
			}
		});
	}

	create(proposal: Partial<JobProposal>): Observable<any> {
		const payload = {
			...proposal.data,
			jobId: proposal.data?.jobId,
			data: proposal.data
		};
		return this.http.post(`${this.API}/create`, payload).pipe(
			map(doc => {
				const fullDoc = { ...doc, ...proposal.data, data: doc?.data || proposal.data };
				const mapped = this._fromDoc(fullDoc);
				this.proposals.update(list => [mapped, ...list]);
				return mapped;
			})
		);
	}

	update(proposal: JobProposal): Observable<any> {
		const payload = {
			_id: proposal._id,
			...proposal.data,
			jobId: proposal.data.jobId,
			data: proposal.data
		};
		return this.http.post(`${this.API}/update`, payload).pipe(
			map(doc => {
				const fullDoc = { ...proposal, ...doc, ...proposal.data, data: doc?.data || proposal.data };
				const mapped = this._fromDoc(fullDoc);
				this.proposals.update(list => list.map(item => item._id === proposal._id ? mapped : item));
				return mapped;
			})
		);
	}

	delete(proposal: JobProposal): Observable<any> {
		return this.http.post(`${this.API}/delete`, { _id: proposal._id }).pipe(
			tap(() => {
				this.proposals.update(list => list.filter(item => item._id !== proposal._id));
			})
		);
	}

	private _fromDoc(doc: any): JobProposal {
		const d = doc.data || {};
		return {
			_id: doc._id || doc.id,
			data: {
				candidateName: doc.candidateName || d.candidateName || '',
				email: doc.email || d.email || '',
				phone: doc.phone || d.phone || '',
				cvUrl: doc.cvUrl || d.cvUrl || '',
				message: doc.message || d.message || '',
				jobId: doc.jobId || d.jobId || '',
				status: doc.status || d.status || 'new'
			}
		} as JobProposal;
	}
}
