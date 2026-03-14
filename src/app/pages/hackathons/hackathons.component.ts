import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HACKATHONS } from '../../data/hackathons.data';

@Component({
	selector: 'app-hackathons',
	imports: [RouterLink],
	templateUrl: './hackathons.component.html',
	styleUrl: './hackathons.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonsComponent {
	protected readonly hackathons = HACKATHONS;
}
