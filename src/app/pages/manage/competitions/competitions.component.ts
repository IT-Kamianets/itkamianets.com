import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { COMPETITIONS } from '../../../data/competitions.data';

@Component({
	imports: [FormsModule],
	templateUrl: './competitions.component.html',
	styleUrl: './competitions.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCompetitionsComponent {
	protected competitions = COMPETITIONS.map((item) => ({ ...item }));

	addCompetition(): void {
		const nextId =
			this.competitions.length > 0
				? Math.max(...this.competitions.map((c) => c.id)) + 1
				: 1;

		this.competitions = [
			...this.competitions,
			{
				id: nextId,
				title: '',
				format: '',
				season: '',
				focus: '',
				description: '',
				stack: [],
				period: '',
				cta: '/competition',
			},
		];
	}

	removeCompetition(id: number): void {
		this.competitions = this.competitions.filter((competition) => competition.id !== id);
	}
}

