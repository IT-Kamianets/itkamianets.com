import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS_TYPES, BUSINESSES, Business } from '../../data/businesses.data';

@Component({
	selector: 'app-businesses',
	imports: [RouterLink],
	templateUrl: './businesses.component.html',
	styleUrl: './businesses.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessesComponent {
	readonly businesses: Business[] = BUSINESSES;
	readonly types: string[] = BUSINESS_TYPES;
	activeType = signal<string>('All');

	setFilter(type: string): void {
		this.activeType.set(type);
	}

	get filteredBusinesses(): Business[] {
		const t = this.activeType();
		if (t === 'All') return this.businesses;
		return this.businesses.filter((b) => b.type === t);
	}
}
