import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Project, PROJECTS } from '../../data/projects.data';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';

interface HackathonTeam {
	id: number;
	name: string;
	summary: string;
	members: TeamMember[];
	projects: Project[];
}

interface PersonCard {
	name: string;
	role: string;
	company: string;
}

@Component({
	selector: 'app-hackathon',
	templateUrl: './hackathon.component.html',
	styleUrl: './hackathon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonComponent {
	private readonly membersById = new Map(TEAM_MEMBERS.map((member) => [member.id, member]));
	private readonly projectsById = new Map(PROJECTS.map((project) => [project.id, project]));

	protected readonly teams: HackathonTeam[] = [
		{
			id: 1,
			name: 'Interface Union',
			summary:
				'Команда сфокусована на чистому публічному інтерфейсі, доступності та акуратній подачі продукту.',
			members: this.pickMembers([2, 3, 9]),
			projects: this.pickProjects([1, 3, 4]),
		},
		{
			id: 2,
			name: 'Velocity Stack',
			summary:
				'Фронтенд-орієнтована команда для швидкого прототипування, перевикористання секцій і стабільного релізу під дедлайн.',
			members: this.pickMembers([4, 5, 6]),
			projects: this.pickProjects([6, 9, 12]),
		},
		{
			id: 3,
			name: 'Launch Crew',
			summary:
				'Продуктова команда, яка поєднує дизайн та реалізацію, щоб перевірити бізнес-цінність і силу демо.',
			members: this.pickMembers([1, 7, 8]),
			projects: this.pickProjects([10, 13, 14]),
		},
	];

	protected readonly judges: PersonCard[] = [
		{
			name: 'Олена Марченко',
			role: 'Product Director',
			company: 'Digital City Lab',
		},
		{
			name: 'Тарас Бондар',
			role: 'Engineering Manager',
			company: 'Frontend Systems Group',
		},
		{
			name: 'Ірина Ковтун',
			role: 'UX Lead',
			company: 'Studio Forma',
		},
	];

	protected readonly sponsors: PersonCard[] = [
		{
			name: 'CloudFrame',
			role: 'Інфраструктурний партнер',
			company: 'Кредити, хостинг та CI-ресурси',
		},
		{
			name: 'Launchbase',
			role: 'Стартап-партнер',
			company: 'Менторство та підтримка демо-дня',
		},
		{
			name: 'PixelDock',
			role: 'Дизайн-партнер',
			company: 'UI-кити та ресурси для прототипування',
		},
	];

	private pickMembers(ids: number[]): TeamMember[] {
		return ids.flatMap((id) => {
			const member = this.membersById.get(id);
			return member ? [member] : [];
		});
	}

	private pickProjects(ids: number[]): Project[] {
		return ids.flatMap((id) => {
			const project = this.projectsById.get(id);
			return project ? [project] : [];
		});
	}
}
