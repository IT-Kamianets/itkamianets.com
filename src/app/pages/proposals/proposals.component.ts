import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROPOSALS, Proposal } from '../../data/proposals.data';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';

@Component({
	selector: 'app-proposals',
	imports: [DecimalPipe],
	templateUrl: './proposals.component.html',
	styleUrl: './proposals.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalsComponent {
	readonly proposals: Proposal[] = PROPOSALS;
	readonly team = TEAM_MEMBERS;

	getTeamMember(name: string): TeamMember | undefined {
		return this.team.find((m) => m.name === name);
	}

	getMemberAvatar(name: string): string {
		const member = this.getTeamMember(name);
		// Відповідно до сторінки Команда, шлях формується як 'developer/' + avatar + '.png'
		return member ? `developer/${member.avatar}.png` : 'logo.png';
	}
}
