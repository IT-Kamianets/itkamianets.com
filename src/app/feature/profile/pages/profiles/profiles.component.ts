import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile.service';
import { Profile } from '../../profile.types';

@Component({
	selector: 'app-feature-profiles',
	imports: [],
	templateUrl: './profiles.component.html',
	styleUrl: './profiles.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesComponent {
	private readonly _router = inject(Router);
	private readonly _profileService = inject(ProfileService);

	readonly activeFilter = signal('');

	/** Динамічні фільтри на основі реальних ролей профілів */
	readonly availableFilters = computed(() => {
		const roleSet = new Set<string>();
		for (const p of this._profileService.profiles()) {
			if (p.role?.trim()) roleSet.add(p.role.trim());
			for (const r of p.roles ?? []) {
				if (r?.trim()) roleSet.add(r.trim());
			}
		}
		const roles = [...roleSet].sort((a, b) => a.localeCompare(b, 'uk'));
		return [{ label: 'Усі', value: '' }, ...roles.map((r) => ({ label: r, value: r }))];
	});

	readonly visibleProfiles = computed<Profile[]>(() => {
		const filter = this.activeFilter();
		const all = this._profileService.profiles();
		return filter ? all.filter((p) => p.role === filter) : all;
	});

	setFilter(value: string): void {
		this.activeFilter.set(value);
	}

	navigateToProfile(id: string): void {
		this._router.navigate(['/profile', id]);
	}

	getSocialEntries(socials: Record<string, string> | undefined) {
		if (!socials) return [];
		return Object.entries(socials)
			.filter(([, value]) => !!value)
			.map(([key, value]) => ({
				key,
				value: value.startsWith('http') ? value : `https://${value}`,
				label: key,
			}));
	}

	photoSrc(avatar: string): string {
		return avatar.includes('/') ? avatar : `developer/${avatar}.png`;
	}
}
