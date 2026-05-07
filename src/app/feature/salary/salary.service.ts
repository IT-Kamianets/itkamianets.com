import { Injectable, signal } from '@angular/core';
import { SALARIES } from '../../data/salaries.data';
import { SalaryData, SalaryCategory } from './salary.interface';

@Injectable({
	providedIn: 'root',
})
export class SalaryService {
	private readonly _salaries = signal<SalaryData[]>(SALARIES);

	readonly salaries = this._salaries.asReadonly();

	readonly categories: SalaryCategory[] = [
		{
			id: 'frontend',
			label: 'Frontend',
			label_ua: 'Frontend',
			count: SALARIES.filter((s) => s.category === 'frontend').length,
		},
		{
			id: 'backend',
			label: 'Backend',
			label_ua: 'Backend',
			count: SALARIES.filter((s) => s.category === 'backend').length,
		},
	];

	getSalariesByCategory(category: 'frontend' | 'backend'): SalaryData[] {
		return this.salaries().filter((s) => s.category === category);
	}
}
