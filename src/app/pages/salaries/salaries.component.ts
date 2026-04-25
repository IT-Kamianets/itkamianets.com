import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryService } from '../../feature/salary/salary.service';
import { SalaryData } from '../../feature/salary/salary.interface';

@Component({
	selector: 'app-salaries',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './salaries.component.html',
	styleUrl: './salaries.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalariesComponent {
	protected readonly salaryService = inject(SalaryService);
	protected readonly selectedCategory = signal<'frontend' | 'backend'>('frontend');
	protected readonly categories = this.salaryService.categories;

	protected readonly filteredSalaries = computed(() => {
		return this.salaryService.getSalariesByCategory(this.selectedCategory());
	});

	selectCategory(category: 'frontend' | 'backend') {
		this.selectedCategory.set(category);
	}

	getAverageSalary(salaries: SalaryData[]): number {
		if (salaries.length === 0) return 0;
		return Math.round(salaries.reduce((sum, s) => sum + s.averageSalary, 0) / salaries.length);
	}

	getTotalJobs(salaries: SalaryData[]): number {
		return salaries.reduce((sum, s) => sum + s.openJobs, 0);
	}

	getTotalCompetitors(salaries: SalaryData[]): number {
		return salaries.reduce((sum, s) => sum + s.competitorsHiring, 0);
	}

	formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(value);
	}

	getTrendIcon(trend?: string): string {
		switch (trend) {
			case 'up':
				return 'trending_up';
			case 'down':
				return 'trending_down';
			default:
				return 'trending_flat';
		}
	}

	getTrendColor(trend?: string): string {
		switch (trend) {
			case 'up':
				return 'text-green-500';
			case 'down':
				return 'text-red-500';
			default:
				return 'text-slate-500';
		}
	}
}
