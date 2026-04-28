import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from '@wawjs/ngx-http';
import { UserService } from '../user/user.service';
import { JobProposal, JobProposalData } from './job-proposal.interface';

@Injectable({ providedIn: 'root' })
export class JobProposalService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/itjobproposal';

	private readonly _proposals = signal<JobProposal[]>([]);
	readonly docs = this._proposals.asReadonly();
	readonly proposals = this.docs;

	constructor() {
		this.load();
	}

	load(): void {
		this._syncToken();
		this._http.get(`${this._basePath}/get`).subscribe({
			next: (docs: any) => {
				const items = Array.isArray(docs) ? docs : (docs?.data || []);
				this._proposals.set(items.map((d: any) => this._mapToProposal(d)));
			},
			error: (err: any) => console.error('Load proposals error:', err)
		});
	}

	new(): JobProposal {
		const proposalData: JobProposalData = {
			candidateName: '',
			email: '',
			phone: '',
			cvUrl: '',
			message: '',
			jobId: '',
			status: 'new'
		};
		return {
			_id: '',
			...proposalData,
			data: proposalData
		} as JobProposal;
	}

	create(proposal: Partial<JobProposalData>): Observable<JobProposal | null> {
		this._syncToken();
		const payload = {
			candidateName: proposal.candidateName || '',
			email: proposal.email || '',
			phone: proposal.phone || '',
			cvUrl: proposal.cvUrl || '',
			message: proposal.message || '',
			jobId: proposal.jobId || '',
			status: proposal.status || 'new',
			data: proposal
		};
		return this._http.post(`${this._basePath}/create`, payload).pipe(
			map(doc => {
				if (!doc) return null;
				const mapped = this._mapToProposal(doc);
				this._proposals.update(list => [mapped, ...list]);
				return mapped;
			}),
			catchError(() => of(null))
		);
	}

	update(proposal: JobProposal): Observable<JobProposal | null> {
		this._syncToken();
		const d = proposal.data || {} as JobProposalData;
		const payload = {
			_id: proposal._id,
			candidateName: d.candidateName || proposal.candidateName || '',
			email: d.email || proposal.email || '',
			phone: d.phone || proposal.phone || '',
			cvUrl: d.cvUrl || proposal.cvUrl || '',
			message: d.message || proposal.message || '',
			jobId: d.jobId || proposal.jobId || '',
			status: d.status || proposal.status || 'new',
			data: d
		};
		return this._http.post(`${this._basePath}/update`, payload).pipe(
			map(doc => {
				if (!doc) return proposal;
				const mapped = this._mapToProposal(doc);
				this._proposals.update(list => list.map(item => item._id === proposal._id ? mapped : item));
				return mapped;
			}),
			catchError(() => of(null))
		);
	}

	delete(proposal: JobProposal): Observable<boolean> {
		this._syncToken();
		return this._http.post(`${this._basePath}/delete`, { _id: proposal._id }).pipe(
			map(() => {
				this._proposals.update(list => list.filter(item => item._id !== proposal._id));
				return true;
			}),
			catchError(() => of(false))
		);
	}

	private _mapToProposal(doc: any): JobProposal {
		const d = doc.data || {};
		const proposalData: JobProposalData = {
			candidateName: doc.candidateName || d.candidateName || '',
			email: doc.email || d.email || '',
			phone: doc.phone || d.phone || '',
			cvUrl: doc.cvUrl || d.cvUrl || '',
			message: doc.message || d.message || '',
			jobId: doc.jobId || d.jobId || '',
			status: doc.status || d.status || 'new'
		};
		return {
			_id: doc._id || doc.id || '',
			...proposalData,
			data: proposalData
		} as JobProposal;
	}

	private _syncToken(): void {
		const token = this._userService.user().token?.trim() || '';
		if (token) {
			this._http.set('token', token);
		} else {
			this._http.remove('token');
		}
	}
}
