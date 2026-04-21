import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
	computed,
	inject,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../profile.service';
import { ProjectService } from '../../../project/project.service';
import { Profile, ProfileSocials } from '../../profile.types';
import { Project } from '../../../project/project.interface';

interface SocialPreset {
	key: string;
	label: string;
	placeholder: string;
	color: string;
}

const SOCIAL_PRESETS: SocialPreset[] = [
	{ key: 'linkedin',  label: 'LinkedIn',    placeholder: 'https://linkedin.com/in/...',       color: '#0a66c2' },
	{ key: 'github',    label: 'GitHub',      placeholder: 'https://github.com/...',            color: '#333'    },
	{ key: 'upwork',    label: 'Upwork',      placeholder: 'https://upwork.com/freelancers/...', color: '#14a800' },
	{ key: 'telegram',  label: 'Telegram',    placeholder: 'https://t.me/...',                  color: '#229ED9' },
	{ key: 'instagram', label: 'Instagram',   placeholder: 'https://instagram.com/...',         color: '#E1306C' },
	{ key: 'tiktok',    label: 'TikTok',      placeholder: 'https://tiktok.com/@...',           color: '#000000' },
	{ key: 'facebook',  label: 'Facebook',    placeholder: 'https://facebook.com/...',          color: '#1877F2' },
	{ key: 'twitter',   label: 'Twitter / X', placeholder: 'https://x.com/...',                color: '#000'    },
];

type TagField = 'roles' | 'achievements';
type TagInput = 'roleInput' | 'achievementInput';

@Component({
	selector: 'app-manage-profiles',
	imports: [FormsModule, RouterLink],
	templateUrl: './manage-profiles.component.html',
	styleUrl: './manage-profiles.component.scss',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ManageProfilesComponent implements OnInit {
	@ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

	private readonly _profileService = inject(ProfileService);
	private readonly _projectService = inject(ProjectService);

	readonly profiles = this._profileService.profiles;
	readonly isModalOpen = signal(false);
	readonly editingProfile = signal<Profile | null>(null);
	readonly allEvents = this._profileService.allEvents;
	readonly socialPresets = SOCIAL_PRESETS;

	allProjects = signal<Project[]>([]);
	projectsLoading = signal(false);
	projectSearch = signal('');
	eventSearch = signal('');
	projectDropdownOpen = signal(false);
	eventDropdownOpen = signal(false);
	activeSocials = new Set<string>();

	form = this._emptyForm();
	roleInput = '';
	achievementInput = '';

	readonly filteredProjects = computed(() => {
		const q = this.projectSearch().trim().toLowerCase();
		return q
			? this.allProjects().filter((p) => p.data?.title?.toLowerCase().includes(q))
			: this.allProjects();
	});

	readonly filteredEvents = computed(() => {
		const q = this.eventSearch().trim().toLowerCase();
		return q
			? this.allEvents().filter((e) => this.getEventTitle(e._id!).toLowerCase().includes(q))
			: this.allEvents();
	});

	// ─── Lifecycle ──────────────────────────────────────────

	ngOnInit(): void {
		this.projectsLoading.set(true);
		this._projectService.getAll().subscribe({
			next: (projects) => {
				this.allProjects.set(projects);
				this.projectsLoading.set(false);
			},
			error: () => this.projectsLoading.set(false),
		});
	}

	// ─── Modal ──────────────────────────────────────────────

	openAddModal(): void {
		this.editingProfile.set(null);
		this.form = this._emptyForm();
		this.roleInput = '';
		this.achievementInput = '';
		this.activeSocials = new Set();
		this._openModal();
	}

	openEditModal(profile: Profile): void {
		this.editingProfile.set(profile);
		this.form = {
			name: profile.name,
			role: profile.role,
			avatar: profile.avatar,
			bio: profile.bio ?? '',
			isHead: profile.isHead,
			roles: [...(profile.roles ?? [profile.role])],
			achievements: [...(profile.achievements ?? [])],
			projects: [...(profile.projects ?? [])],
			events: [...(profile.events ?? [])],
			socials: { ...(profile.socials ?? {}) },
		};
		this.activeSocials = new Set(
			Object.entries(this.form.socials)
				.filter(([, val]) => !!val)
				.map(([key]) => key)
		);
		this.roleInput = '';
		this.achievementInput = '';
		this._openModal();
	}

	closeModal(): void {
		this.isModalOpen.set(false);
		this.editingProfile.set(null);
		document.body.style.overflow = '';
	}

	// ─── Avatar ─────────────────────────────────────────────

	triggerFileInput(): void {
		this.fileInputRef?.nativeElement.click();
	}

	onFileChange(event: Event): void {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => { this.form = { ...this.form, avatar: reader.result as string }; };
		reader.readAsDataURL(file);
	}

	// ─── Socials ────────────────────────────────────────────

	isSocialActive(key: string): boolean {
		return this.activeSocials.has(key);
	}

	toggleSocial(key: string): void {
		if (this.activeSocials.has(key)) {
			this.activeSocials.delete(key);
			delete this.form.socials[key];
		} else {
			this.activeSocials.add(key);
			if (!this.form.socials[key]) this.form.socials[key] = '';
		}
	}

	getSocialEntries(socials: ProfileSocials): { key: string; value: string }[] {
		if (!socials) return [];
		return Object.entries(socials)
			.filter(([, val]) => !!val)
			.map(([key, value]) => ({ key, value }));
	}

	// ─── Projects ───────────────────────────────────────────

	isProjectSelected(id: string): boolean {
		return this.form.projects.includes(id);
	}

	toggleProject(id: string): void {
		this.form.projects = this.form.projects.includes(id)
			? this.form.projects.filter((p) => p !== id)
			: [...this.form.projects, id];
	}

	removeProject(id: string): void {
		if (id) this.form.projects = this.form.projects.filter((p) => p !== id);
	}

	toggleProjectDropdown(): void {
		this.projectDropdownOpen.set(!this.projectDropdownOpen());
		if (this.projectDropdownOpen()) this.eventDropdownOpen.set(false);
	}

	getProjectTitle(id: string): string {
		return this.allProjects().find((p) => p._id === id)?.data?.title ?? id;
	}

	// ─── Events ─────────────────────────────────────────────

	isEventSelected(id: string): boolean {
		return this.form.events.includes(id);
	}

	toggleEvent(id: string): void {
		this.form.events = this.form.events.includes(id)
			? this.form.events.filter((e) => e !== id)
			: [...this.form.events, id];
	}

	removeEvent(id: string): void {
		if (id) this.form.events = this.form.events.filter((e) => e !== id);
	}

	toggleEventDropdown(): void {
		this.eventDropdownOpen.set(!this.eventDropdownOpen());
		if (this.eventDropdownOpen()) this.projectDropdownOpen.set(false);
	}

	getEventTitle(id: string): string {
		const e = this.allEvents().find((ev) => ev._id === id) as any;
		return e ? e.title ?? e.name ?? e.data?.title ?? id : id;
	}

	// ─── Tags ───────────────────────────────────────────────

	addTag(field: TagField, inputKey: TagInput): void {
		const value = this[inputKey].trim();
		if (!value) return;
		if (!this.form[field].includes(value)) {
			this.form[field] = [...this.form[field], value];
		}
		this[inputKey] = '';
	}

	removeTag(field: TagField, tag: string): void {
		this.form[field] = this.form[field].filter((t) => t !== tag);
	}

	onTagKeydown(event: KeyboardEvent, field: TagField, inputKey: TagInput): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.addTag(field, inputKey);
		}
	}

	// ─── Save / Delete ──────────────────────────────────────

	save(): void {
		const editing = this.editingProfile();
		const primaryRole = this.form.roles[0] || this.form.role || this.form.name;
		const cleanSocials: ProfileSocials = {};

		for (const key of Array.from(this.activeSocials)) {
			const val = this.form.socials[key]?.trim();
			if (val) cleanSocials[key] = val;
		}

		const payload = { ...this.form, role: primaryRole, socials: cleanSocials };

		if (editing) {
			this._profileService.updateProfile({ ...editing, ...payload });
		} else {
			this._profileService.add(payload as Omit<Profile, '_id'>);
		}

		this.closeModal();
	}

	delete(id: string): void {
		if (confirm('Ви впевнені, що хочете видалити цей профіль?')) {
			this._profileService.deleteProfile(id);
		}
	}

	photoSrc(avatar: string): string {
		if (!avatar) return '';
		return avatar.includes('/') ? avatar : `developer/${avatar}.png`;
	}

	// ─── Private helpers ────────────────────────────────────

	private _openModal(): void {
		this.isModalOpen.set(true);
		document.body.style.overflow = 'hidden';
	}

	private _emptyForm() {
		return {
			name: '',
			role: '',
			avatar: '',
			bio: '',
			isHead: false,
			roles: [] as string[],
			achievements: [] as string[],
			projects: [] as string[],
			events: [] as string[],
			socials: {} as ProfileSocials,
		};
	}
}
