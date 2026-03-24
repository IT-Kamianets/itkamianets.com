import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Job } from './job.interface';
import { Observable, tap } from 'rxjs';
import { HttpService } from 'wacom';

@Injectable({ providedIn: 'root' })
export class JobService {
	private http = inject(HttpService);
	private API = `/api/itjob`;

	readonly jobs = signal<Job[]>([]);

	constructor() {
		this.load();
	}

	load(): void {
		this.http.get(`${this.API}/get`).subscribe({
			next: (docs) => {
				if (Array.isArray(docs)) {
					this.jobs.set(docs.map(d => this._fromDoc(d)));
				}
			}
		});
	}

	create(job: Partial<Job>): Observable<any> {
		return this.http.post(`${this.API}/create`, { data: job.data }).pipe(
			tap(doc => {
				if (doc?._id) {
					this.jobs.update(list => [this._fromDoc(doc), ...list]);
				}
			})
		);
	}

	update(job: Job): Observable<any> {
		return this.http.post(`${this.API}/update`, { _id: job._id, data: job.data }).pipe(
			tap(doc => {
				this.jobs.update(list => list.map(item => item._id === job._id ? this._fromDoc(doc || job) : item));
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
			tap(doc => {
				if (doc?._id) {
					const mapped = this._fromDoc(doc);
					this.jobs.update(list => {
						const exists = list.find(item => item._id === mapped._id);
						return exists ? list.map(item => item._id === mapped._id ? mapped : item) : [...list, mapped];
					});
				}
			})
		);
	}

	private _fromDoc(doc: any): Job {
		return {
			_id: doc._id,
			...doc, // зберігаємо оригінальні поля якщо є
			data: doc.data || {
				title: doc.title || '',
				description: doc.description || '',
				authorName: doc.authorName || '',
				published: !!doc.published,
				preview: doc.preview || ''
			}
		} as Job;
	}
}
