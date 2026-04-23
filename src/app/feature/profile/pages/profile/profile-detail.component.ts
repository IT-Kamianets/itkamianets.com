import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, filter, map, switchMap } from 'rxjs';
import { ProfileService } from '../../profile.service';
import { ProjectService } from '../../../project/project.service';
import { Profile } from '../../profile.types';

@Component({
	selector: 'app-profile-detail',
	imports: [RouterLink],
	templateUrl: './profile-detail.component.html',
	styleUrl: './profile-detail.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDetailComponent {
	private readonly _profileService = inject(ProfileService);
	private readonly _projectService = inject(ProjectService);
	private readonly _route = inject(ActivatedRoute);

	private readonly _routeId = toSignal(
		this._route.paramMap.pipe(map((p) => p.get('id') ?? ''))
	);

	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly _fetchedProfile = toSignal<Profile | null>(
		this._route.paramMap.pipe(
			map((p) => p.get('id')),
			filter((id): id is string => !!id),
			switchMap((id) =>
				this._isBrowser ? this._profileService.fetchById(id) : EMPTY
			)
		),
		{ initialValue: null }
	);

	readonly profile = computed((): Profile | null | undefined => {
		const id = this._routeId();
		if (!id) return null;
		return this._profileService.profiles().find((p) => p._id === id) ?? this._fetchedProfile();
	});

	private readonly _allProjects = toSignal(this._projectService.getAll(), { initialValue: [] });
	private readonly _allEvents = this._profileService.allEvents;

	readonly profileProjects = computed(() => {
		const ids = this.profile()?.projects ?? [];
		return ids.length ? this._allProjects().filter((p) => p._id && ids.includes(p._id)) : [];
	});

	readonly profileEvents = computed(() => {
		const ids = this.profile()?.events ?? [];
		return ids.length ? this._allEvents().filter((e) => e._id && ids.includes(e._id)) : [];
	});

	readonly socialEntries = computed(() =>
		Object.entries(this.profile()?.socials ?? {})
			.filter(([, val]) => !!val)
			.map(([key, value]) => ({
				key,
				value,
				label: key.charAt(0).toUpperCase() + key.slice(1),
				initial: this._socialInitial(key),
			}))
	);

	readonly profileRoles = computed(() => {
		const p = this.profile();
		if (!p) return [];
		if (p.roles?.length) return p.roles;
		if (p.role) return [p.role];
		return [];
	});

	photoSrc(avatar: string | undefined): string {
		if (!avatar) return '';
		return avatar.includes('/') ? avatar : `developer/${avatar}.png`;
	}

	// ─── Private helpers ────────────────────────────────────

	private _socialInitial(key: string): string {
		const map: Record<string, string> = {
			linkedin: 'in',
			github: '{ }',
			upwork: 'up',
			telegram: '✈',
			instagram: '◈',
			tiktok: '♪',
			facebook: 'f',
			twitter: 'X',
		};
		return map[key] ?? key.slice(0, 2).toUpperCase();
	}
}
