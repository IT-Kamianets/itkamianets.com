import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HACKATHON_PAGE } from '../../data/hackathons.data';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';

@Component({
	selector: 'app-team',
	templateUrl: './team.component.html',
	styleUrl: './team.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent {
	readonly showTemporarySpecialists = false;
	readonly founders: TeamMember[] = TEAM_MEMBERS.filter((member) => member.isHead).map((member) =>
		this._mapTeamMember(member)
	);
	readonly developers: TeamMember[] = TEAM_MEMBERS.filter((member) => !member.isHead).map(
		(member) => this._mapTeamMember(member)
	);
	readonly qaSpecialists: TeamMember[] = [
		this._createDemoMember(
			101,
			'Коваль Марія',
			'QA спеціаліст',
			'Червень 2025 - теперішній час'
		),
		this._createDemoMember(
			102,
			'Шевчук Олег',
			'QA спеціаліст',
			'Липень 2025 - теперішній час'
		),
		this._createDemoMember(
			103,
			'Ткачук Ірина',
			'QA спеціаліст',
			'Серпень 2025 - теперішній час'
		),
	];
	readonly smmSpecialists: TeamMember[] = [
		this._createDemoMember(
			201,
			'Мельник Анна',
			'SMM спеціаліст',
			'Травень 2025 - теперішній час'
		),
		this._createDemoMember(
			202,
			'Бондар Владислав',
			'SMM спеціаліст',
			'Червень 2025 - теперішній час'
		),
		this._createDemoMember(
			203,
			'Романюк Софія',
			'SMM спеціаліст',
			'Вересень 2025 - теперішній час'
		),
	];
	readonly hackathonJudges: TeamMember[] = HACKATHON_PAGE.judges.map((judge, index) => ({
		id: 300 + index,
		name: judge.name,
		role: 'Суддя хакатону',
		avatar: judge.photo,
		internshipDates: 'Запрошений експерт',
		university: 'Web Art Work Hackathon',
		isHead: false,
		socials: {
			linkedin: '#',
			github: '#',
			upwork: '#',
		},
	}));

	photoSrc(member: TeamMember) {
		return member.avatar.includes('/') ? member.avatar : `developer/${member.avatar}.png`;
	}

	private _mapTeamMember(member: TeamMember) {
		return {
			...member,
			role: this._roleLabel(member.role),
			university: member.university === 'WebArtWork' ? 'Web Art Work' : member.university,
		};
	}

	private _createDemoMember(id: number, name: string, role: string, internshipDates: string) {
		return {
			id,
			name,
			role,
			avatar: 'Honchar_Denys',
			internshipDates,
			university: 'Web Art Work',
			isHead: false,
			socials: {
				linkedin: '#',
				github: '#',
				upwork: '#',
			},
		};
	}

	private _roleLabel(role: string) {
		switch (role) {
			case 'Head of Team / Full-stack Developer':
				return 'Керівник команди / Фулстек-розробник';
			case 'Frontend Developer':
				return 'Фронтенд-розробник';
			case 'UI/UX Designer':
				return 'UI/UX дизайнер';
			default:
				return role;
		}
	}
}
