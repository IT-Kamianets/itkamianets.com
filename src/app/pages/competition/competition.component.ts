import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COMPETITION_PAGE } from '../../data/competitions.data';

@Component({
	selector: 'app-competition',
	templateUrl: './competition.component.html',
	styleUrl: './competition.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetitionComponent {
	protected readonly page = COMPETITION_PAGE;
}

