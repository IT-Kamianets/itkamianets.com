<<<<<<< HEAD
<<<<<<< HEAD
import { Injectable, inject, signal } from '@angular/core';
=======
import { Injectable, computed } from '@angular/core';
import { CrudService } from '@wawjs/ngx-crud';
>>>>>>> 2afd0d29802756d20c45c43f0bfdb3d9dae8ae87
import { Job } from './job.interface';
import { Observable, tap, map } from 'rxjs';
=======
import { Injectable, inject, signal } from '@angular/core';
<<<<<<< HEAD
import { Observable, catchError, map, of } from 'rxjs';
=======
import { Observable, catchError, map, of, timeout } from 'rxjs';
>>>>>>> 65460afd3fec1163b0ef7e3e41b73b8e6e58e66c
>>>>>>> e44287c9d133f035d30836541aa309c32d0f5724
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
<<<<<<< HEAD
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
=======

<<<<<<< HEAD
<<<<<<< HEAD
	update(job: Job): Observable<any> {
		return this.http.post(`${this.API}/update`, { _id: job._id, data: job.data }).pipe(
			map(doc => {
				const mapped = this._fromDoc(doc || job);
				this.jobs.update(list => list.map(item => item._id === job._id ? mapped : item));
				return mapped;
			})
		);
	}

	delete(job: Job): Observable<any> {
		return this.http.post(`${this.API}/delete`, { _id: job._id }).pipe(
			tap(() => {
				this.jobs.update(list => list.filter(item => item._id !== job._id));
			})
		);
	}

	fetch(id: string): Observable<any> {
		return this.http.post(`${this.API}/fetch`, { _id: id }).pipe(
=======
		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
>>>>>>> 65460afd3fec1163b0ef7e3e41b73b8e6e58e66c
>>>>>>> e44287c9d133f035d30836541aa309c32d0f5724
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

<<<<<<< HEAD
=======
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

<<<<<<< HEAD
	private _fromDoc(doc: any): Job {
		const d = doc.data || doc || {};
		return {
			_id: doc._id || doc.id,
			data: {
				title: d.title || '',
				description: d.description || '',
				company: d.company || '',
				requirements: Array.isArray(d.requirements) ? d.requirements : [],
				status: d.status || (d.published ? 'active' : 'closed') || 'active',
				preview: d.preview || ''
			}
		} as Job;
=======
	private _seedDemoJobs() {
		const demoJobs: Partial<Job>[] = [
			{
				title: 'Корпоративний сайт для агрохолдингу',
				description: '<h2>Про проєкт</h2><p>Розробка сучасного адаптивного сайту.</p>',
				authorName: 'Гончар Денис',
				published: true,
				preview:
					'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop',
			},
			{
				title: 'Платформа для онлайн-курсів',
				description: '<h2>Опис</h2><p>Створення LMS-системи для школи програмування.</p>',
				authorName: 'Вальцер Вадим',
				published: true,
				preview:
					'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=500&fit=crop',
			},
		];

		demoJobs.forEach((job) => {
			this.create(job as Job).subscribe();
		});
>>>>>>> 2afd0d29802756d20c45c43f0bfdb3d9dae8ae87
=======
>>>>>>> e44287c9d133f035d30836541aa309c32d0f5724
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
>>>>>>> 65460afd3fec1163b0ef7e3e41b73b8e6e58e66c
	}
}
