import { Injectable, inject, signal } from '@angular/core';
import { Job, JobData } from './job.interface';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class JobService {
	private http = inject(HttpService);
	private userService = inject(UserService);
	private API = `/api/itjob`;

	readonly jobs = signal<Job[]>([]);

	constructor() {
		this.load();
	}

	load(): void {
		this._syncToken();
		this.http.get(`${this.API}/get`).subscribe({
			next: (docs: any) => {
				if (Array.isArray(docs)) {
					this.jobs.set(docs.map((d: any) => this._fromDoc(d)));
				}
			},
			error: (err) => console.error('Load jobs error:', err)
		});
	}

	create(job: Partial<Job>): Observable<Job | null> {
		this._syncToken();
		const d = job.data || {} as JobData;
		
		// СУВОРО: Тільки дозволені поля в корені
		const payload: any = {
			title: d.title || '',
			description: d.description || '',
			preview: d.preview || '',
			published: d.status === 'active',
			status: d.status || 'active',
			requirements: d.requirements || [],
			// Все інше - в data
			data: {
				company: d.company || ''
			}
		};

		return this.http.post(`${this.API}/create`, payload).pipe(
			map(doc => {
				if (!doc || doc === 'false') return null;
				const mapped = this._fromDoc(doc);
				this.jobs.update(list => [mapped, ...list]);
				return mapped;
			}),
			catchError(err => {
				console.error('Create error:', err);
				return of(null);
			})
		);
	}

	update(job: Job): Observable<Job | null> {
		this._syncToken();
		const d = job.data || {} as JobData;
		
		const payload: any = {
			_id: job._id, // Для update ID обов'язковий
			title: d.title || '',
			description: d.description || '',
			preview: d.preview || '',
			published: d.status === 'active',
			status: d.status || 'active',
			requirements: d.requirements || [],
			data: {
				company: d.company || ''
			}
		};

		return this.http.post(`${this.API}/update`, payload).pipe(
			map(doc => {
				if (!doc || doc === 'false') return null;
				const mapped = this._fromDoc(doc);
				this.jobs.update(list => list.map(item => item._id === job._id ? mapped : item));
				return mapped;
			}),
			catchError(err => {
				console.error('Update error:', err);
				return of(null);
			})
		);
	}

	delete(job: Job): Observable<boolean> {
		this._syncToken();
		return this.http.post(`${this.API}/delete`, { _id: job._id }).pipe(
			map(res => {
				if (res === 'false') return false;
				this.jobs.update(list => list.filter(item => item._id !== job._id));
				return true;
			}),
			catchError(err => {
				console.error('Delete error:', err);
				return of(false);
			})
		);
	}

	fetch(id: string): Observable<Job | null> {
		this._syncToken();
		return this.http.post(`${this.API}/fetch`, { _id: id }).pipe(
			map(doc => (doc && doc !== 'false') ? this._fromDoc(doc) : null),
			catchError(() => of(null))
		);
	}

	private _fromDoc(doc: any): Job {
		const d = doc?.data || {};
		const jobData: JobData = {
			title: doc.title || d.title || '',
			description: doc.description || d.description || '',
			company: d.company || doc.company || '',
			requirements: Array.isArray(doc.requirements) ? doc.requirements : (Array.isArray(d.requirements) ? d.requirements : []),
			status: doc.status || d.status || (doc.published ? 'active' : 'closed') || 'active',
			preview: doc.preview || d.preview || '',
			published: doc.published ?? d.published ?? false,
			authorName: doc.authorName || '',
			authorId: doc.authorId || ''
		};
		return {
			_id: doc._id || '',
			...jobData,
			data: jobData
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
