import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';
import { JobProposal } from './job-proposal.interface';

@Injectable({ providedIn: 'root' })
export class JobProposalService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/itjobproposal';

	readonly proposals = signal<JobProposal[]>([]);

	constructor() {
		this.load();
	}

	load(): void {
		this._syncToken();

		this._http.get(`${this._basePath}/get`).subscribe({
			next: (docs: any) => {
				const data = Array.isArray(docs) ? docs : (docs?.data || []);
				if (Array.isArray(data)) {
					this.proposals.set(data.map((d: any) => this._mapToProposal(d)));
				}
			}
		});
	}

	create(proposal: Partial<JobProposal>): Observable<JobProposal | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/create`, proposal).pipe(
			map(doc => {
				const mapped = this._mapToProposal(doc || proposal);
				this.proposals.update(list => [mapped, ...list]);
				return mapped;
			}),
			catchError(() => of(null))
		);
	}

	update(proposal: JobProposal): Observable<JobProposal | null> {
		this._syncToken();

		const payload = { _id: proposal._id, ...proposal };
		return this._http.post(`${this._basePath}/update`, payload).pipe(
			map(doc => {
				const mapped = this._mapToProposal(doc || proposal);
				this.proposals.update(list => list.map(item => item._id === proposal._id ? mapped : item));
				return mapped;
			}),
			catchError(() => of(null))
		);
	}

	delete(proposal: JobProposal): Observable<boolean> {
		this._syncToken();

		return this._http.post(`${this._basePath}/delete`, { _id: proposal._id }).pipe(
			map(() => {
				this.proposals.update(list => list.filter(item => item._id !== proposal._id));
				return true;
			}),
			catchError(() => of(false))
		);
	}

	private _mapToProposal(doc: any): JobProposal {
		const source = doc.data ? { ...doc, ...doc.data } : doc;
		return {
			_id: doc._id || doc.id || '',
			candidateName: source.candidateName || '',
			email: source.email || '',
			phone: source.phone || '',
			cvUrl: source.cvUrl || '',
			message: source.message || '',
			jobId: source.jobId || '',
			status: source.status || 'new'
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
