import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
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
				const items = Array.isArray(docs) ? docs : (docs?.data || []);
				this.jobs.set(items.map((d: any) => this._mapToJob(d)));
			}
		});
	}

	fetch(id: string): Observable<Job | null> {
		this._syncToken();
		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
			map(doc => doc ? this._mapToJob(doc) : null),
			catchError(() => of(null))
		);
	}

	create(job: Partial<Job>): Observable<Job | null> {
		this._syncToken();
		const user = this._userService.user();
		// Create a clean, plain object
		const payload = {
			title: job.title || '',
			description: job.description || '',
			requirements: job.requirements || [],
			status: job.status || 'active',
			company: job.company || '',
			preview: job.preview || '',
			published: job.published || false,
			authorName: user.name || '',
			authorId: user._id || ''
		};

		return this._http.post(`${this._basePath}/create`, payload).pipe(
			map(doc => {
				if (doc) {
					const mapped = this._mapToJob(doc);
					this.jobs.update(list => [mapped, ...list]);
					return mapped;
				}
				return null;
			}),
			catchError(() => of(null))
		);
	}

	update(job: Job): Observable<Job | null> {
		this._syncToken();
		// Create a clean, plain object for update
		const payload = {
			_id: job._id,
			title: job.title || '',
			description: job.description || '',
			requirements: job.requirements || [],
			status: job.status || 'active',
			company: job.company || '',
			preview: job.preview || '',
			published: job.published || false
		};

		return this._http.post(`${this._basePath}/update`, payload).pipe(
			map(doc => {
				if (doc) {
					const mapped = this._mapToJob(doc);
					this.jobs.update(list => list.map(item => item._id === job._id ? mapped : item));
					return mapped;
				}
				return job;
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
			_id: doc._id || source._id || '',
			title: source.title || '',
			company: source.company || '',
			description: source.description || '',
			requirements: Array.isArray(source.requirements) ? source.requirements : [],
			status: source.status || 'active',
			preview: source.preview || '',
			published: source.published || false,
			authorId: source.authorId || '',
			authorName: source.authorName || ''
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
