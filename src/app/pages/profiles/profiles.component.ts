import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';

@Component({
	selector: 'app-profiles',
	imports: [RouterLink],
	templateUrl: './profiles.component.html',
	styleUrl: './profiles.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesComponent {
	protected readonly people = signal<TeamMember[]>(TEAM_MEMBERS);
}
