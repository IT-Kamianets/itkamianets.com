import { Component, signal } from '@angular/core';
import { TEAM_MEMBERS, TeamMemberFull } from '../../data/team.data';

@Component({
	selector: 'app-our-team',
	standalone: true,
	imports: [],
	templateUrl: './our-team.html',
	styleUrl: './our-team.css',
})
export class OurTeam {
	members = TEAM_MEMBERS;
	selectedMember = signal<TeamMemberFull | null>(null);

	openMember(member: TeamMemberFull): void {
		this.selectedMember.set(member);
		document.body.style.overflow = 'hidden';
	}

	closeMember(): void {
		this.selectedMember.set(null);
		document.body.style.overflow = '';
	}
}