import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from 'wacom';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { CertificateOption } from './certificate-option.interface';

@Injectable({
	providedIn: 'root',
})
export class CertificateOptionService {
	private readonly _http = inject(HttpService);

	private readonly _options = signal<CertificateOption[]>([]);
	readonly docs = this._options.asReadonly();

	constructor() {}

	seedDemoOptions() {
		this._seedDemoOptions();
	}

	getAll(): Observable<CertificateOption[]> {
		return this._http.get('/api/itcertificateoption/get').pipe(
			map((response: unknown) => {
				const items = Array.isArray(response) ? (response as CertificateOption[]) : [];
				this._options.set(items);
				return items;
			}),
			catchError(() => of([])),
		);
	}

	new(): Partial<CertificateOption> {
		return {
			data: {
				title: '',
				description: '',
				templateStyle: 'classic',
			},
		};
	}

	create(option: Partial<CertificateOption>): Observable<CertificateOption | null> {
		const data = option.data;
		const payload = {
			...option,
			data: {
				title: data?.title || '',
				description: data?.description || '',
				templateStyle: data?.templateStyle || 'classic',
			},
		};
		return this._http.post('/api/itcertificateoption/create', payload).pipe(
			map((res: unknown) => (res ? (res as CertificateOption) : null)),
			tap((newOpt) => {
				if (newOpt) {
					this._options.update((opts) => [...opts, newOpt]);
				}
			}),
			catchError(() => of(null)),
		);
	}

	update(option: CertificateOption): Observable<CertificateOption | null> {
		const data = option.data;
		const payload = {
			_id: option._id,
			data: {
				title: data?.title || '',
				description: data?.description || '',
				templateStyle: data?.templateStyle || 'classic',
			},
		};
		return this._http.post('/api/itcertificateoption/update', payload).pipe(
			map((res: unknown) => (res ? (res as CertificateOption) : null)),
			tap((updatedOpt) => {
				if (updatedOpt) {
					this._options.update((opts) =>
						opts.map((o) => (o._id === updatedOpt._id ? updatedOpt : o)),
					);
				}
			}),
			catchError(() => of(null)),
		);
	}

	delete(option: CertificateOption): Observable<boolean> {
		return this._http.post('/api/itcertificateoption/delete', { _id: option._id }).pipe(
			map((res: unknown) => !!res),
			tap((success) => {
				if (success) {
					this._options.update((opts) => opts.filter((o) => o._id !== option._id));
				}
			}),
			catchError(() => of(false)),
		);
	}

	private _seedDemoOptions() {
		const demoOptions: Partial<CertificateOption>[] = [
			{
				data: {
					title: 'Сертифікат про завершення курсу',
					description:
						'За успішне проходження повного курсу та захист фінального проєкту. Підтверджує набуті знання та практичні навички.',
					templateStyle: 'classic',
				},
			},
			{
				data: {
					title: 'Диплом переможця хакатону',
					description:
						'За зайняте призове місце в хакатоні та видатні досягнення в розробці інноваційного продукту.',
					templateStyle: 'modern',
				},
			},
			{
				data: {
					title: 'Подяка спікеру',
					description:
						'За вагомий внесок у розвиток IT-спільноти, обмін досвідом та підготовку унікальної доповіді.',
					templateStyle: 'minimalist',
				},
			},
		];

		demoOptions.forEach((opt) => {
			this.create(opt).subscribe();
		});
	}
}
