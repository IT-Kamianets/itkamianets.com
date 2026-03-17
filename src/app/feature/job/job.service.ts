import { Injectable, computed } from '@angular/core';
import { CrudService } from 'wacom';
import { Job } from './job.interface';

@Injectable({
	providedIn: 'root',
})
export class JobService extends CrudService<Job> {
	constructor() {
		super({
			name: 'item', // Використовуємо існуючу колекцію item
		});

		this.get().subscribe((items) => {
			// Якщо немає жодного айтема з типом job, створюємо демо
			const jobs = items.filter(i => (i as any).type === 'job');
			if (jobs.length === 0) {
				this._seedDemoJobs();
			}
		});
	}

	// Фільтруємо всі документи, щоб бачити тільки "job"
	private _allSignals = this.getSignals('', undefined);

	readonly docs = computed(() => {
		return this._allSignals()
			.map((sig) => sig())
			.filter((doc: any) => doc.type === 'job');
	});

	// Перевизначаємо створення, щоб завжди додавати type: 'job'
	override create(job: Job) {
		(job as any).type = 'job';
		return super.create(job);
	}

	private _seedDemoJobs() {
		const demoJobs: Partial<Job>[] = [
			{
				title: 'Корпоративний сайт для агрохолдингу',
				description: '<h2>Про проєкт</h2><p>Розробка сучасного адаптивного сайту.</p>',
				authorName: 'Гончар Денис',
				published: true,
				preview: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop'
			},
			{
				title: 'Платформа для онлайн-курсів',
				description: '<h2>Опис</h2><p>Створення LMS-системи для школи програмування.</p>',
				authorName: 'Вальцер Вадим',
				published: true,
				preview: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=500&fit=crop'
			}
		];

		demoJobs.forEach(job => {
			this.create(job as Job).subscribe();
		});
	}
}
