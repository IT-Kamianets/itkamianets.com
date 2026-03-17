import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { PROJECTS } from '../../data/projects.data';
import { ManagedProject, ManagedProjectDraft, ProjectCategory } from './project.interface';

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _storageKey = 'itk_projects_v1';

	readonly projects = signal<ManagedProject[]>(this._readInitialProjects());

	constructor() {
		this._save();
	}

	createProject(draft: ManagedProjectDraft): ManagedProject {
		const now = new Date().toISOString();
		const project: ManagedProject = {
			...draft,
			id: this._createId(),
			createdAt: now,
			updatedAt: now,
		};

		this.projects.update((list) => [project, ...list]);
		this._save();
		return project;
	}

	updateProject(id: string, draft: ManagedProjectDraft): void {
		this.projects.update((list) =>
			list.map((project) =>
				project.id === id
					? {
						...project,
						...draft,
						updatedAt: new Date().toISOString(),
					}
					: project,
			),
		);
		this._save();
	}

	removeProject(id: string): void {
		this.projects.update((list) => list.filter((project) => project.id !== id));
		this._save();
	}

	getProjectById(id: string): ManagedProject | undefined {
		return this.projects().find((project) => project.id === id);
	}

	private _readInitialProjects(): ManagedProject[] {
		if (!isPlatformBrowser(this._platformId)) {
			return this._defaultProjects();
		}

		const raw = localStorage.getItem(this._storageKey);
		if (!raw) {
			return this._defaultProjects();
		}

		try {
			const parsed = JSON.parse(raw) as unknown;
			if (!Array.isArray(parsed)) {
				return this._defaultProjects();
			}

			const normalized = parsed
				.filter((item): item is Partial<ManagedProject> => typeof item === 'object' && item !== null)
				.map((item) => this._normalizeProject(item))
				.filter((item): item is ManagedProject => item !== null);

			return normalized.length ? normalized : this._defaultProjects();
		} catch {
			localStorage.removeItem(this._storageKey);
			return this._defaultProjects();
		}
	}

	private _normalizeProject(item: Partial<ManagedProject>): ManagedProject | null {
		const title = (item.title || '').trim();
		const description = (item.description || '').trim();
		const repoUrl = (item.repoUrl || '').trim();
		const liveUrl = (item.liveUrl || '').trim();
		const image = (item.image || '').trim();

		if (!title || !description || !repoUrl || !liveUrl || !image) {
			return null;
		}

		return {
			id: item.id || this._createId(),
			title,
			description,
			tags: Array.isArray(item.tags)
				? item.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
				: [],
			repoUrl,
			liveUrl,
			image,
			imageKind: item.imageKind === 'upload' ? 'upload' : 'asset',
			memberIds: Array.isArray(item.memberIds)
				? item.memberIds.filter((id): id is number => Number.isInteger(id) && id > 0)
				: [],
			category: this._normalizeCategory(item.category),
			createdAt: item.createdAt || new Date().toISOString(),
			updatedAt: item.updatedAt || new Date().toISOString(),
		};
	}

	private _normalizeCategory(category: ManagedProject['category'] | undefined): ProjectCategory {
		if (category === 'theme-tailwind' || category === 'theme-bulma' || category === 'theme-bootstrap') {
			return category;
		}

		return 'custom';
	}

	private _defaultProjects(): ManagedProject[] {
		const now = new Date().toISOString();
		return PROJECTS.map((project) => ({
			id: `legacy-${project.id}`,
			title: project.title,
			description: project.description,
			tags: [...project.tags],
			repoUrl: project.repoUrl,
			liveUrl: project.liveUrl,
			image: project.image,
			imageKind: 'asset' as const,
			memberIds: [1],
			category: project.category,
			createdAt: now,
			updatedAt: now,
		}));
	}

	private _createId(): string {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}

		return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}

	private _save(): void {
		if (!isPlatformBrowser(this._platformId)) {
			return;
		}

		localStorage.setItem(this._storageKey, JSON.stringify(this.projects()));
	}
}