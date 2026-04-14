import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, timeout } from 'rxjs';
import { HttpService } from 'wacom';
import { UserService } from '../user/user.service';
import { Job } from './job.interface';

@Injectable({ providedIn: 'root' })
export class JobService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/itjob';

	readonly jobs = signal<Job[]>([]);

	constructor() {
		this.load();
	}

	load(): void {
		this._syncToken();

		this._http.get(`${this._basePath}/get`).subscribe({
			next: (docs: any) => {
				const data = Array.isArray(docs) ? docs : (docs?.data || []);
				if (Array.isArray(data)) {
					this.jobs.set(data.map((d: any) => this._mapToJob(d)));
				}
			}
		});
	}

	fetch(id: string): Observable<Job | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
			map(doc => {
				if (doc) {
					const mapped = this._mapToJob(doc);
					this.jobs.update(list => {
						const exists = list.find(item => item._id === mapped._id);
						return exists ? list.map(item => item._id === mapped._id ? mapped : item) : [...list, mapped];
					});
					return mapped;
				}
				return null;
			}),
			catchError(() => of(null))
		);
	}

	create(job: Partial<Job>): Observable<Job | null> {
		this._syncToken();

		// Send fields at root level (NO data wrapper, NO company - backend doesn't support it)
		const payload = {
			title: job.title || '',
			description: job.description || '',
			requirements: job.requirements || [],
			status: job.status || 'active',
			authorName: job.authorName || '',
			authorId: job.authorId || '',
			published: job.published ?? false,
			preview: job.preview || '',
		};

		return this._http.post(`${this._basePath}/create`, payload).pipe(
			timeout(10000),
			map(doc => {
				console.log('create response:', doc);
				if (!doc || doc === false) {
					console.warn('Job creation failed: server returned false.');
					return null;
				}
				const mapped = this._mapToJob(doc);
				this.jobs.update(list => [mapped, ...list]);
				return mapped;
			}),
			catchError((err: any) => {
				console.error('Job creation error:', err);
				if (err.name === 'TimeoutError') {
					console.error('⏱ Request timed out: The API server is taking too long.');
				} else if (err.status === 504) {
					console.error('Gateway Timeout: The API server is not responding.');
				} else if (err.status === 0) {
					console.error('Network Error: Cannot reach the API server.');
				}
				return of(null);
			})
		);
	}

	update(job: Job): Observable<Job | null> {
		this._syncToken();

		// Send fields at root level (NO company - backend doesn't support it)
		const payload = {
			_id: job._id,
			title: job.title || '',
			description: job.description || '',
			requirements: job.requirements || [],
			status: job.status || 'active',
			authorName: job.authorName || '',
			authorId: job.authorId || '',
			published: job.published ?? false,
			preview: job.preview || '',
		};

		return this._http.post(`${this._basePath}/update`, payload).pipe(
			map(doc => {
				console.log('update response:', doc);
				if (!doc || doc === false) {
					return job;
				}
				const mapped = this._mapToJob(doc);
				this.jobs.update(list => list.map(item => item._id === job._id ? mapped : item));
				return mapped;
			}),
			catchError(() => of(null))
		);
	}

	delete(job: Job): Observable<boolean> {
		this._syncToken();

		return this._http.post(`${this._basePath}/delete`, { _id: job._id }).pipe(
			map(() => {
				this.jobs.update(list => list.filter(item => item._id !== job._id));
				return true;
			}),
			catchError(() => of(false))
		);
	}

	private _mapToJob(doc: any): Job {
		const source = doc.data ? { ...doc, ...doc.data } : doc;
		return {
			_id: doc._id || doc.id || '',
			title: source.title || '',
			company: source.company || '',
			description: source.description || '',
			requirements: Array.isArray(source.requirements) ? source.requirements : [],
			status: source.status || 'active',
			authorName: source.authorName || '',
			authorId: source.authorId || '',
			published: source.published || false,
			preview: source.preview || ''
		} as Job;
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
