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
import { ProfileService } from '../../profile.service';
import { ProjectService } from '../../../project/project.service';
import { Profile, ProfileSocials } from '../../profile.types';
import { Project } from '../../../project/project.interface';

/** Заготовки підтримуваних соцмереж */
const SOCIAL_PRESETS: { key: string; label: string; placeholder: string; color: string }[] = [
	{ key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...', color: '#0a66c2' },
	{ key: 'github', label: 'GitHub', placeholder: 'https://github.com/...', color: '#333' },
	{ key: 'upwork', label: 'Upwork', placeholder: 'https://upwork.com/freelancers/...', color: '#14a800' },
	{ key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/...', color: '#229ED9' },
	{ key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...', color: '#E1306C' },
	{ key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...', color: '#000000' },
	{ key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...', color: '#1877F2' },
	{ key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/...', color: '#000' },
];

@Component({
	selector: 'app-manage-profiles',
	imports: [FormsModule],
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

	/** Всі доступні проєкти для вибору через чекбокси */
	allProjects = signal<Project[]>([]);
	projectsLoading = signal(false);

	/** Всі доступні івенти для вибору (отримуються напряму з ProfileService, де є HttpService для них) */
	readonly allEvents = this._profileService.allEvents;

	/** Пошук по проєктах */
	projectSearch = signal('');
	/** Пошук по заходах */
	eventSearch = signal('');

	/** Стан випадаючого списку проєктів */
	projectDropdownOpen = signal(false);
	/** Стан випадаючого списку заходів */
	eventDropdownOpen = signal(false);

	/** Заготовки соцмереж */
	readonly socialPresets = SOCIAL_PRESETS;
	/** Які соцмережі активовані (показано поле) */
	activeSocials = new Set<string>();

	// Main form fields
	form = this.getEmptyForm();

	// Tag input buffers (залишаються для role/achievement)
	roleInput = '';
	achievementInput = '';

	/** Відфільтровані проєкти по рядку пошуку */
	filteredProjects = computed(() => {
		const q = this.projectSearch().trim().toLowerCase();
		if (!q) return this.allProjects();
		return this.allProjects().filter((p) =>
			p.data?.title?.toLowerCase().includes(q)
		);
	});

	/** Відфільтровані івенти по рядку пошуку */
	filteredEvents = computed(() => {
		const q = this.eventSearch().trim().toLowerCase();
		if (!q) return this.allEvents();
		return this.allEvents().filter((e) =>
			this.getEventTitle(e._id!).toLowerCase().includes(q)
		);
	});

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

	openAddModal() {
		this.editingProfile.set(null);
		this.form = this.getEmptyForm();
		this.roleInput = '';
		this.achievementInput = '';
		this.activeSocials = new Set<string>();
		this.isModalOpen.set(true);
		document.body.style.overflow = 'hidden';
	}

	triggerFileInput() {
		this.fileInputRef?.nativeElement.click();
	}

	onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			this.form = { ...this.form, avatar: reader.result as string };
		};
		reader.readAsDataURL(file);
	}

	openEditModal(profile: Profile) {
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

		// Визначаємо які соцмережі вже заповнені -> активуємо чекбокси
		this.activeSocials = new Set<string>(
			Object.entries(this.form.socials)
				.filter(([, val]) => !!val)
				.map(([key]) => key),
		);

		this.roleInput = '';
		this.achievementInput = '';
		this.isModalOpen.set(true);
		document.body.style.overflow = 'hidden';
	}

	closeModal() {
		this.isModalOpen.set(false);
		this.editingProfile.set(null);
		document.body.style.overflow = '';
	}

	// --- Соцмережі ---

	isSocialActive(key: string): boolean {
		return this.activeSocials.has(key);
	}

	toggleSocial(key: string): void {
		if (this.activeSocials.has(key)) {
			this.activeSocials.delete(key);
			delete this.form.socials[key];
		} else {
			this.activeSocials.add(key);
			if (!this.form.socials[key]) {
				this.form.socials[key] = '';
			}
		}
	}

	getSocialEntries(socials: ProfileSocials): { key: string; value: string }[] {
		if (!socials) return [];
		return Object.entries(socials)
			.filter(([, val]) => !!val)
			.map(([key, value]) => ({ key, value }));
	}

	// --- Проєкти ---

	isProjectSelected(id: string): boolean {
		return this.form.projects.includes(id);
	}

	toggleProject(id: string): void {
		if (this.form.projects.includes(id)) {
			this.form.projects = this.form.projects.filter((p) => p !== id);
		} else {
			this.form.projects = [...this.form.projects, id];
		}
	}

	removeProject(id: string): void {
		if (!id) return;
		this.form.projects = this.form.projects.filter((p) => p !== id);
	}

	toggleProjectDropdown(): void {
		this.projectDropdownOpen.set(!this.projectDropdownOpen());
		if (this.projectDropdownOpen()) {
			this.eventDropdownOpen.set(false);
		}
	}

	getProjectTitle(id: string): string {
		return this.allProjects().find((p) => p._id === id)?.data?.title ?? id;
	}

	// --- Івенти ---

	isEventSelected(id: string): boolean {
		return this.form.events.includes(id);
	}

	toggleEvent(id: string): void {
		if (this.form.events.includes(id)) {
			this.form.events = this.form.events.filter((e) => e !== id);
		} else {
			this.form.events = [...this.form.events, id];
		}
	}

	removeEvent(id: string): void {
		if (!id) return;
		this.form.events = this.form.events.filter((e) => e !== id);
	}

	toggleEventDropdown(): void {
		this.eventDropdownOpen.set(!this.eventDropdownOpen());
		if (this.eventDropdownOpen()) {
			this.projectDropdownOpen.set(false);
		}
	}

	getEventTitle(id: string): string {
		const evt: any = this.allEvents().find((e) => e._id === id);
		if (!evt) return id;
		return evt.title || evt.name || evt.data?.title || id;
	}

	// --- Tag helpers ---

	addTag(field: 'roles' | 'achievements', inputKey: 'roleInput' | 'achievementInput') {
		const value = this[inputKey].trim();
		if (!value) return;
		if (!this.form[field].includes(value)) {
			this.form[field] = [...this.form[field], value];
		}
		this[inputKey] = '';
	}

	removeTag(field: 'roles' | 'achievements', tag: string) {
		this.form[field] = this.form[field].filter((t) => t !== tag);
	}

	onTagKeydown(event: KeyboardEvent, field: 'roles' | 'achievements', inputKey: 'roleInput' | 'achievementInput') {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.addTag(field, inputKey);
		}
	}

	save() {
		const editing = this.editingProfile();
		// Беремо першу роль з тегів; якщо немає — беремо поле role; якщо і воно порожнє — ім'я
		const primaryRole = this.form.roles[0] || this.form.role || this.form.name;

		const cleanSocials: ProfileSocials = {};
		for (const key of Array.from(this.activeSocials)) {
			const val = this.form.socials[key]?.trim();
			if (val) cleanSocials[key] = val;
		}

		const payload = {
			...this.form,
			role: primaryRole,
			socials: cleanSocials,
		};

		console.log('[ManageProfiles] save payload:', payload);

		if (editing) {
			this._profileService.updateProfile({ ...editing, ...payload });
		} else {
			this._profileService.add(payload as Omit<Profile, '_id'>);
		}

		this.closeModal();
	}

	delete(id: string) {
		if (confirm('Ви впевнені, що хочете видалити цей профіль?')) {
			this._profileService.deleteProfile(id);
		}
	}

	photoSrc(avatar: string): string {
		if (!avatar) return '';
		return avatar.includes('/') ? avatar : `developer/${avatar}.png`;
	}

	private getEmptyForm() {
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
