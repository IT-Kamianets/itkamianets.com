import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { HttpService } from '@wawjs/ngx-http';
import { UserService } from '../user/user.service';
import { Job, JobData } from './job.interface';

@Injectable({ providedIn: 'root' })
export class JobService {
	private http = inject(HttpService);
	private userService = inject(UserService);
	private API = `/api/itjob`;

	private _jobs = signal<Job[]>([]);
	readonly docs = this._jobs.asReadonly();
	readonly jobs = this.docs;

	constructor() {
		this.load();
	}

	load(): void {
		this._syncToken();
		this.http.get(`${this.API}/get`).subscribe({
			next: (docs: any) => {
				if (Array.isArray(docs)) {
					this._jobs.set(docs.map((doc: any) => this._fromDoc(doc)));
				}
			},
			error: (err: any) => console.error('Load jobs error:', err),
		});
	}

	new(): Job {
		return {
			_id: '',
			title: '',
			description: '',
			company: '',
			requirements: [],
			status: 'active',
			preview: '',
			published: false,
			authorName: '',
			authorId: '',
			data: {
				title: '',
				description: '',
				company: '',
				requirements: [],
				status: 'active',
				preview: '',
				published: false,
				authorName: '',
				authorId: '',
			},
		} as Job;
	}

	create(job: Partial<Job>): Observable<Job | null> {
		this._syncToken();
		const d = (job.data || {}) as JobData;

		const payload: any = {
			title: d.title || job.title || '',
			description: d.description || job.description || '',
			preview: d.preview || job.preview || '',
			published: d.status === 'active' || job.status === 'active',
			status: d.status || job.status || 'active',
			requirements: d.requirements || job.requirements || [],
			data: {
				...d,
				company: d.company || job.company || '',
			},
		};

		return this.http.post(`${this.API}/create`, payload).pipe(
			map((doc) => {
				if (!doc || doc === 'false') return null;
				const mapped = this._fromDoc(doc);
				this._jobs.update((list) => [mapped, ...list]);
				return mapped;
			}),
			catchError((err: any) => {
				console.error('Create error:', err);
				return of(null);
			}),
		);
	}

	update(job: Job): Observable<Job | null> {
		this._syncToken();
		const d = (job.data || {}) as JobData;

		const payload: any = {
			_id: job._id,
			title: d.title || job.title || '',
			description: d.description || job.description || '',
			preview: d.preview || job.preview || '',
			published: d.status === 'active' || job.status === 'active',
			status: d.status || job.status || 'active',
			requirements: d.requirements || job.requirements || [],
			data: {
				...d,
				company: d.company || job.company || '',
			},
		};

		return this.http.post(`${this.API}/update`, payload).pipe(
			map((doc) => {
				if (!doc || doc === 'false') return null;
				const mapped = this._fromDoc(doc);
				this._jobs.update((list) => list.map((item) => (item._id === job._id ? mapped : item)));
				return mapped;
			}),
			catchError((err: any) => {
				console.error('Update error:', err);
				return of(null);
			}),
		);
	}

	delete(job: Job): Observable<boolean> {
		this._syncToken();
		return this.http.post(`${this.API}/delete`, { _id: job._id }).pipe(
			map((res) => {
				if (res === 'false') return false;
				this._jobs.update((list) => list.filter((item) => item._id !== job._id));
				return true;
			}),
			catchError((err: any) => {
				console.error('Delete error:', err);
				return of(false);
			}),
		);
	}

	fetch(id: string): Observable<Job | null> {
		this._syncToken();
		return this.http.post(`${this.API}/fetch`, { _id: id }).pipe(
			map((doc) => (doc && doc !== 'false' ? this._fromDoc(doc) : null)),
			catchError(() => of(null)),
		);
	}

	private _fromDoc(doc: any): Job {
		const d = doc?.data || {};
		const jobData: JobData = {
			title: doc.title || d.title || '',
			description: doc.description || d.description || '',
			company: d.company || doc.company || '',
			requirements: Array.isArray(doc.requirements)
				? doc.requirements
				: Array.isArray(d.requirements)
					? d.requirements
					: [],
			status: doc.status || d.status || (doc.published ? 'active' : 'closed') || 'active',
			preview: doc.preview || d.preview || '',
			published: doc.published ?? d.published ?? false,
			authorName: doc.authorName || '',
			authorId: doc.authorId || '',
		};

		return {
			_id: doc._id || '',
			...jobData,
			data: jobData,
		} as Job;
	}

	private _syncToken(): void {
		const user = this.userService.user();
		const token = user?.token?.trim() || '';

		if (token) {
			this.http.set('token', token);
		}
	}
}
