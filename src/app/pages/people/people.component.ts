import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TEAM_MEMBERS, TeamMember } from '../../data/team.data';

@Component({
	selector: 'app-people',
	imports: [RouterLink],
	templateUrl: './people.component.html',
	styleUrl: './people.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleComponent {
	private readonly route = inject(ActivatedRoute);

	private readonly routeId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))));

	protected readonly person = computed<TeamMember | undefined>(() => {
		const idStr = this.routeId();
		if (!idStr) return undefined;
		const id = parseInt(idStr, 10);
		return TEAM_MEMBERS.find((m) => m.id === id);
	});
}
