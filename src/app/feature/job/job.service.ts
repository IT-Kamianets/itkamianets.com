<<<<<<< HEAD
import { Injectable, inject, signal } from '@angular/core';
=======
import { Injectable, computed } from '@angular/core';
import { CrudService } from '@wawjs/ngx-crud';
>>>>>>> 2afd0d29802756d20c45c43f0bfdb3d9dae8ae87
import { Job } from './job.interface';
import { Observable, tap, map } from 'rxjs';
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
			next: (docs: any) => {
				const data = Array.isArray(docs) ? docs : (docs?.data || []);
				if (Array.isArray(data)) {
					this.jobs.set(data.map((d: any) => this._fromDoc(d)));
				}
			}
		});
	}

	create(job: Partial<Job>): Observable<any> {
		return this.http.post(`${this.API}/create`, { data: job.data }).pipe(
			map(doc => {
				const mapped = this._fromDoc(doc || { data: job.data });
				this.jobs.update(list => [mapped, ...list]);
				return mapped;
			})
		);
	}

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
			map(doc => {
				if (doc) {
					const mapped = this._fromDoc(doc);
					this.jobs.update(list => {
						const exists = list.find(item => item._id === mapped._id);
						return exists ? list.map(item => item._id === mapped._id ? mapped : item) : [...list, mapped];
					});
					return mapped;
				}
				return null;
			})
		);
	}

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
	}
}
