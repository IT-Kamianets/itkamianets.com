import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile.service';
import { Profile } from '../../profile.types';

const ROLE_FILTERS = [
	{ label: 'Усі', value: '' },
	{ label: 'Засновники', value: 'head' },
	{ label: 'Розробники', value: 'Фронтенд-розробник' },
	{ label: 'Дизайнери', value: 'UI/UX дизайнер' },
	{ label: 'QA', value: 'QA спеціаліст' },
	{ label: 'SMM', value: 'SMM спеціаліст' },
	{ label: 'Судді', value: 'Суддя хакатону' },
] as const;

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

	readonly filters = ROLE_FILTERS;
	readonly activeFilter = signal<string>('');

	readonly visibleProfiles = computed<Profile[]>(() => {
		const filter = this.activeFilter();

		const allProfiles = this._profileService.profiles();

		if (filter === 'head') return allProfiles.filter((p) => p.isHead);
		if (filter !== '') return allProfiles.filter((p) => p.role === filter);
		return allProfiles;
	});

	setFilter(value: string): void {
		this.activeFilter.set(value);
	}

	navigateToProfile(id: string): void {
		this._router.navigate(['/profile', id]);
	}

	getSocialEntries(socialMap: Record<string, string> | undefined) {
		if (!socialMap) return [];
		return Object.entries(socialMap)
			.filter(([_, value]) => !!value && value !== '')
			.map(([key, value]) => ({
				key,
				value: value.startsWith('http') ? value : `https://${value}`,
				label: key
			}));
	}

	photoSrc(avatar: string): string {
		return avatar.includes('/') ? avatar : `developer/${avatar}.png`;
	}
}
