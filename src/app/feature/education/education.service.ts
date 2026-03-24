import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import {
	DEFAULT_EDUCATION_INSTITUTIONS,
	createEmptyEducationInstitutionDraft,
} from './education.const';
import { EducationInstitution, EducationInstitutionDraft } from './education.interface';

const STORAGE_KEY = 'itk_education_institutions';

const cloneInstitution = (institution: EducationInstitution): EducationInstitution => ({
	...institution,
});

const cloneInstitutions = (
	institutions: readonly EducationInstitution[],
): EducationInstitution[] => institutions.map(cloneInstitution);

const sortInstitutions = (
	institutions: readonly EducationInstitution[],
): EducationInstitution[] => {
	return [...institutions].sort((left, right) => {
		return (
			Number(right.featured) - Number(left.featured)
			|| Number(right.published) - Number(left.published)
			|| left.name.localeCompare(right.name, 'uk')
		);
	});
};

const isEducationInstitution = (value: unknown): value is EducationInstitution => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const institution = value as Partial<EducationInstitution>;

	return typeof institution.id === 'string'
		&& typeof institution.name === 'string'
		&& typeof institution.shortName === 'string'
		&& typeof institution.type === 'string'
		&& typeof institution.ownership === 'string'
		&& typeof institution.address === 'string'
		&& typeof institution.district === 'string'
		&& typeof institution.phone === 'string'
		&& typeof institution.email === 'string'
		&& typeof institution.website === 'string'
		&& typeof institution.principal === 'string'
		&& typeof institution.studentsCount === 'number'
		&& typeof institution.foundedYear === 'number'
		&& typeof institution.status === 'string'
		&& typeof institution.featured === 'boolean'
		&& typeof institution.published === 'boolean'
		&& typeof institution.notes === 'string'
		&& typeof institution.updatedAt === 'string';
};

@Injectable({
	providedIn: 'root',
})
export class EducationService {
	private readonly _platformId = inject(PLATFORM_ID);
	readonly institutions = signal<EducationInstitution[]>(
		sortInstitutions(cloneInstitutions(DEFAULT_EDUCATION_INSTITUTIONS)),
	);
	readonly publishedInstitutions = computed(() => {
		return this.institutions().filter((institution) => institution.published);
	});

	constructor() {
		if (!isPlatformBrowser(this._platformId)) {
			return;
		}

		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return;
		}

		try {
			const parsed = JSON.parse(stored) as unknown;
			if (Array.isArray(parsed) && parsed.every(isEducationInstitution)) {
				this.institutions.set(sortInstitutions(parsed));
				return;
			}
		} catch {
			// Ignore malformed local data and restore the defaults below.
		}

		localStorage.removeItem(STORAGE_KEY);
	}

	upsertInstitution(draft: EducationInstitutionDraft, editingId: string | null = null) {
		const nextInstitution: EducationInstitution = {
			...createEmptyEducationInstitutionDraft(),
			...draft,
			id: editingId || this._createId(draft.shortName || draft.name),
			studentsCount: Math.max(0, Math.round(draft.studentsCount || 0)),
			foundedYear: Math.max(1800, Math.round(draft.foundedYear || new Date().getFullYear())),
			updatedAt: new Date().toISOString(),
		};

		if (editingId) {
			this._commit(
				this.institutions().map((institution) => {
					return institution.id === editingId ? nextInstitution : institution;
				}),
			);
			return;
		}

		this._commit([...this.institutions(), nextInstitution]);
	}

	removeInstitution(id: string) {
		this._commit(this.institutions().filter((institution) => institution.id !== id));
	}

	duplicateInstitution(id: string) {
		const institution = this.institutions().find((entry) => entry.id === id);
		if (!institution) {
			return;
		}

		this._commit([
			...this.institutions(),
			{
				...cloneInstitution(institution),
				id: this._createId(`${institution.shortName}-copy`),
				name: `${institution.name} (копія)`,
				shortName: `${institution.shortName} copy`,
				published: false,
				featured: false,
				updatedAt: new Date().toISOString(),
			},
		]);
	}

	togglePublished(id: string) {
		this._commit(
			this.institutions().map((institution) => {
				return institution.id === id
					? {
						...institution,
						published: !institution.published,
						updatedAt: new Date().toISOString(),
					}
					: institution;
			}),
		);
	}

	resetToDefaults() {
		this._commit(cloneInstitutions(DEFAULT_EDUCATION_INSTITUTIONS));
	}

	private _commit(institutions: EducationInstitution[]) {
		const next = sortInstitutions(institutions);
		this.institutions.set(next);

		if (isPlatformBrowser(this._platformId)) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		}
	}

	private _createId(seed: string) {
		return `${seed
			.toLowerCase()
			.replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
			.replace(/^-+|-+$/g, '')}-${Date.now()}`;
	}
}