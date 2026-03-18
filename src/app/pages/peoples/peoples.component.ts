import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';

@Component({
	selector: 'app-peoples',
	imports: [RouterLink],
	templateUrl: './peoples.component.html',
	styleUrl: './peoples.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeoplesComponent {
	protected readonly peoples = signal<TeamMember[]>(TEAM_MEMBERS);
}
