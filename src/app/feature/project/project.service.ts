import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../user/user.service';
import { Project, ProjectData } from './project.interface';

@Injectable({
providedIn: 'root',
})
export class ProjectService {
private readonly _http = inject(HttpClient);
private readonly _userService = inject(UserService);
private readonly _platformId = inject(PLATFORM_ID);
private readonly _baseUrl = 'https://api.webart.work/api/itproject';

getAll(): Observable<Project[]> {
return this._http
.get<any[]>(`${this._baseUrl}/get`, this._authOptions())
.pipe(
map(response => {
if (!Array.isArray(response)) return [];
return response.map(item => this._mapToProject(item));
}),
catchError(() => of([]))
);
}

  create(projectData: ProjectData): Observable<Project | null> {
    const payload = {
      title: projectData.title,
      description: projectData.description,
      category: "custom", // HARDCODED to bypass backend enum crash
      tags: projectData.tags,
      repoUrl: projectData.githubLink,
      liveUrl: projectData.websiteLink,
      memberIds: projectData.team,
      image: projectData.photo,
      imageKind: projectData.imageKind,
      data: projectData // The flexible object holding the REAL category and completionDate
    };

    return this._http
      .post<any>(`${this._baseUrl}/create`, payload, this._authOptions())
      .pipe(
        map(item => item ? this._mapToProject(item) : null),
        catchError((error) => {
          console.error('Create error:', error);
          return of(null);
        })
      );
  }

  update(id: string, projectData: ProjectData): Observable<Project | null> {
    const payload = {
      _id: id,
      title: projectData.title,
      description: projectData.description,
      category: "custom", // HARDCODED to bypass backend enum crash
      tags: projectData.tags,
      repoUrl: projectData.githubLink,
      liveUrl: projectData.websiteLink,
      memberIds: projectData.team,
      image: projectData.photo,
      imageKind: projectData.imageKind,
      data: projectData // The flexible object holding the REAL category and completionDate
    };

    return this._http
      .post<any>(`${this._baseUrl}/update`, payload, this._authOptions())
      .pipe(
        map(item => item ? this._mapToProject(item) : null),
        catchError((error) => {
          console.error('Update error:', error);
          return of(null);
        })
      );
  }

delete(id: string): Observable<boolean> {
return this._http
.post<boolean>(`${this._baseUrl}/delete`, { _id: id }, this._authOptions())     
.pipe(
map(() => true),
catchError(() => of(false))
);
}

fetchOne(id: string): Observable<Project | null> {
return this._http
.post<any>(`${this._baseUrl}/fetch`, { _id: id }, this._authOptions())
.pipe(
map(item => item ? this._mapToProject(item) : null),
catchError(() => of(null))
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
team: Array.isArray(source.memberIds) ? source.memberIds : (Array.isArray(source.team) ? source.team : []),
completionDate: source.completionDate || source.completedAt || '',
imageKind: source.imageKind || 'asset'
}
};
}

private _authOptions(): { headers?: HttpHeaders } {
const token = this._resolveToken();
if (!token) {
return {};
}

return {
headers: new HttpHeaders({
token,
}),
};
}

private _resolveToken(): string {
const signalToken = this._userService.user().token?.trim();
if (signalToken) {
return signalToken;
}

if (!isPlatformBrowser(this._platformId)) {
return '';
}

try {
const raw = localStorage.getItem('waw_user');
if (!raw) {
return '';
}

const parsed = JSON.parse(raw) as { token?: unknown };
return typeof parsed.token === 'string' ? parsed.token.trim() : '';
} catch {
return '';
}
}
}
