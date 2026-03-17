import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEAM_MEMBERS } from '../../data/team.data';

@Component({
	selector: 'app-peoples',
	imports: [RouterLink],
	templateUrl: './peoples.component.html',
	styleUrl: './peoples.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeoplesComponent {
	protected readonly members = TEAM_MEMBERS;
}
