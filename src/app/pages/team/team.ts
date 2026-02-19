import { Component } from '@angular/core';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';

@Component({
	selector: 'app-team',
	templateUrl: './team.html',
	styleUrl: './team.css',
})
export class Team {
	readonly head: TeamMember = TEAM_MEMBERS.find(m => m.isHead)!;
	readonly members: TeamMember[] = TEAM_MEMBERS.filter(m => !m.isHead);
}
