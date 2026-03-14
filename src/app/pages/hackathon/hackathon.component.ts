import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HACKATHON_PAGE } from '../../data/hackathons.data';

@Component({
	selector: 'app-hackathon',
	templateUrl: './hackathon.component.html',
	styleUrl: './hackathon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonComponent {
	protected readonly page = HACKATHON_PAGE;
}
