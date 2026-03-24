import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPETITIONS } from '../../data/competitions.data';

@Component({
	selector: 'app-competitions',
	imports: [RouterLink],
	templateUrl: './competitions.component.html',
	styleUrl: './competitions.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetitionsComponent {
	protected readonly competitions = COMPETITIONS;
}

