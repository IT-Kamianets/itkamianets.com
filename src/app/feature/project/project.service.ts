import { Injectable, inject } from '@angular/core';
import { HttpService } from 'wacom';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../user/user.service';
import { Project, ProjectData } from './project.interface';

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/itproject';

	getAll(): Observable<Project[]> {
		this._syncToken();

		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: unknown) => {
				if (!Array.isArray(response)) {
					return [];
				}

				return response.map((item) => this._mapToProject(item));
			}),
			catchError(() => of([])),
		);
	}

	create(projectData: ProjectData): Observable<Project | null> {
		const payload = {
			title: projectData.title,
			description: projectData.description,
			category: 'custom',
			tags: projectData.tags,
			repoUrl: projectData.githubLink,
			liveUrl: projectData.websiteLink,
			memberIds: projectData.team,
			image: projectData.photo,
			imageKind: projectData.imageKind,
			data: projectData,
		};

		this._syncToken();

		return this._http.post(`${this._basePath}/create`, payload).pipe(
			map((item: unknown) => (item ? this._mapToProject(item) : null)),
			catchError(() => of(null)),
		);
	}

	update(id: string, projectData: ProjectData): Observable<Project | null> {
		const payload = {
			_id: id,
			title: projectData.title,
			description: projectData.description,
			category: 'custom',
			tags: projectData.tags,
			repoUrl: projectData.githubLink,
			liveUrl: projectData.websiteLink,
			memberIds: projectData.team,
			image: projectData.photo,
			imageKind: projectData.imageKind,
			data: projectData,
		};

		this._syncToken();

		return this._http.post(`${this._basePath}/update`, payload).pipe(
			map((item: unknown) => (item ? this._mapToProject(item) : null)),
			catchError(() => of(null)),
		);
	}

	delete(id: string): Observable<boolean> {
		this._syncToken();

		return this._http.post(`${this._basePath}/delete`, { _id: id }).pipe(
			map(() => true),
			catchError(() => of(false)),
		);
	}

	fetchOne(id: string): Observable<Project | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
			map((item: unknown) => (item ? this._mapToProject(item) : null)),
			catchError(() => of(null)),
		);
	}

	private _mapToProject(item: any): Project {
		const source = item.data ? { ...item, ...item.data } : item;

		return {
			_id: item._id,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			data: {
				title: source.title || '',
				description: source.description || '',
				photo: source.image || source.photo || '',
				category: source.category || '',
				tags: Array.isArray(source.tags) ? source.tags : [],
				githubLink: source.repoUrl || source.githubLink || '',
				websiteLink: source.liveUrl || source.websiteLink || '',
				team: Array.isArray(source.memberIds)
					? source.memberIds
					: Array.isArray(source.team)
						? source.team
						: [],
				completionDate: source.completionDate || source.completedAt || '',
				imageKind: source.imageKind || 'asset',
			},
		};
	}

	private _syncToken(): void {
		const token = this._userService.user().token?.trim() || '';

		if (token) {
			this._http.set('token', token);
		} else {
			this._http.remove('token');
		}
	}
}
