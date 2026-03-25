import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpService } from 'wacom';
import { CertificateOption } from './certificate-option.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CertificateOptionService {
	private readonly _http = inject(HttpService);
	
	private readonly _options = signal<CertificateOption[]>([]);
	readonly docs = this._options.asReadonly();

	constructor() {
		this.getAll().subscribe(items => {
			if (items.length === 0) {
				this._seedDemoOptions();
			}
		});
	}

	getAll(): Observable<CertificateOption[]> {
		return this._http.get('/api/itcertificateoption/get').pipe(
			map((response: unknown) => {
				const items = Array.isArray(response) ? (response as CertificateOption[]) : [];
				this._options.set(items);
				return items;
			}),
			catchError(() => of([]))
		);
	}

	new(): Partial<CertificateOption> {
		return { data: {} };
	}

	create(option: Partial<CertificateOption>): Observable<CertificateOption | null> {
		return this._http.post('/api/itcertificateoption/create', option).pipe(
			map((res: unknown) => res ? (res as CertificateOption) : null),
			tap(newOpt => {
				if (newOpt) {
					this._options.update(opts => [...opts, newOpt]);
				}
			}),
			catchError(() => of(null))
		);
	}

	update(option: CertificateOption): Observable<CertificateOption | null> {
		return this._http.post('/api/itcertificateoption/update', option).pipe(
			map((res: unknown) => res ? (res as CertificateOption) : null),
			tap(updatedOpt => {
				if (updatedOpt) {
					this._options.update(opts => opts.map(o => o._id === updatedOpt._id ? updatedOpt : o));
				}
			}),
			catchError(() => of(null))
		);
	}

	delete(option: CertificateOption): Observable<boolean> {
		return this._http.post('/api/itcertificateoption/delete', { _id: option._id }).pipe(
			map(() => true),
			tap(success => {
				if (success) {
					this._options.update(opts => opts.filter(o => o._id !== option._id));
				}
			}),
			catchError(() => of(false))
		);
	}

	private _seedDemoOptions() {
		const demoOptions = [
			{
				data: {
					title: 'Сертифікат про завершення курсу',
					description: 'За успішне проходження повного курсу та захист фінального проєкту. Підтверджує набуті знання та практичні навички.',
					templateStyle: 'classic',
				}
			},
			{
				data: {
					title: 'Диплом переможця хакатону',
					description: 'За зайняте призове місце в хакатоні та видатні досягнення в розробці інноваційного продукту.',
					templateStyle: 'modern',
				}
			},
			{
				data: {
					title: 'Подяка спікеру',
					description: 'За вагомий внесок у розвиток IT-спільноти, обмін досвідом та підготовку унікальної доповіді.',
					templateStyle: 'minimalist',
				}
			}
		];

		demoOptions.forEach(opt => {
			this.create(opt).subscribe();
		});
	}
}
