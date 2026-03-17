import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { TEAM_MEMBERS } from '../../data/team.data';
import { PROJECTS } from '../../data/projects.data';
import { HACKATHONS } from '../../data/hackathons.data';
import { repos } from '../../data/repos';
import { AdminService } from '../../services/admin.service';

@Component({
	selector: 'app-people',
	imports: [DatePipe],
	templateUrl: './people.component.html',
	styleUrl: './people.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly adminService = inject(AdminService);
	private readonly queryParams = toSignal(this.route.queryParams);

	readonly member = computed(() => {
		const id = this.queryParams()?.['id'] ? Number(this.queryParams()?.['id']) : 1;
		const devs = this.adminService.developers();
		return devs.find((m: any) => m.id === id) || devs[0];
	});

	// Filter projects assigned to this specific developer in the AdminService
	readonly memberProjects = computed(() => {
		const m = this.member();
		if (!m) return [];
		return this.adminService.projects().filter((p: any) => p.authorUsername === m.avatar);
	});

	// Filtering repos explicitly listed for this developer
	readonly memberRepos = computed(() => {
		const m = this.member();
		if (!m) return [];
		return repos.filter((r) => r.developer === m.avatar || r.contributors?.some(c => c.login === m.avatar)).slice(0, 10);
	});
    
	readonly memberHackathons = computed(() => {
		// Mocked for now, but could be filtered by team members
		return HACKATHONS;
	});
}
