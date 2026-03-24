import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from 'wacom';

export interface SchoolData {
	title: string;
	description: string;
	shortName?: string;
	type?: string;
	address?: string;
	principal?: string;
	phone?: string;
	email?: string;
	website?: string;
	studentsCount?: number;
	published?: boolean;
	featured?: boolean;
	courses?: string[];
	lessons?: string[];
	[key: string]: unknown;
}

export interface School {
	_id: string;
	data: SchoolData;
}

export type SchoolInput = SchoolData;

export const createEmptySchoolData = (): SchoolData => ({
	title: '',
	description: '',
	shortName: '',
	type: '',
	address: '',
	principal: '',
	phone: '',
	email: '',
	website: '',
	studentsCount: 0,
	published: true,
	featured: false,
	courses: [],
	lessons: [],
});

@Injectable({
	providedIn: 'root',
})
export class SchoolService {
	private readonly _http = inject(HttpService);
	private readonly _apiUrl = '/api/itschool';

	getSchools() {
		return this._http.get(`${this._apiUrl}/get`).pipe(
			map((response) => this._extractSchoolList(response)),
			catchError((error) => this._handleError(error)),
		);
	}

	getSchoolById(id: string) {
		return this._http.post(`${this._apiUrl}/fetch`, { _id: id }).pipe(
			map((response) => this._extractSchool(response)),
			catchError((error) => this._handleError(error)),
		);
	}

	createSchool(data: SchoolInput) {
		return this._http.post(`${this._apiUrl}/create`, this._toSavePayload(data)).pipe(
			map((response) => this._extractMutationResult(response)),
			catchError((error) => this._handleError(error)),
		);
	}

	updateSchool(id: string, data: SchoolInput) {
		return this._http
			.post(`${this._apiUrl}/update`, { _id: id, ...this._toSavePayload(data) })
			.pipe(
				map((response) => this._extractMutationResult(response)),
			catchError((error) => this._handleError(error)),
			);
	}

	deleteSchool(id: string) {
		return this._http.post(`${this._apiUrl}/delete`, { _id: id }).pipe(
			map((response) => this._extractDeleteResult(response)),
			catchError((error) => this._handleError(error)),
		);
	}

	private _toSavePayload(data: SchoolInput) {
		const normalized = {
			...createEmptySchoolData(),
			...data,
		};
		const { title, description, ...rest } = normalized;

		return {
			title,
			description,
			data: rest,
		};
	}

	private _extractMutationResult(response: unknown) {
		if (!response || response === false) {
			return null;
		}

		if (response && typeof response === 'object') {
			return this._normalizeSchool(response);
		}

		return null;
	}

	private _extractDeleteResult(response: unknown) {
		return response !== false;
	}

	private _extractSchoolList(response: unknown) {
		if (Array.isArray(response)) {
			return response.map((item) => this._normalizeSchool(item));
		}

		if (response && typeof response === 'object') {
			const container = response as Record<string, unknown>;
			const list =
				container['list']
				?? container['schools']
				?? container['data']
				?? container['result'];

			if (Array.isArray(list)) {
				return list.map((item) => this._normalizeSchool(item));
			}
		}

		return [];
	}

	private _extractSchool(response: unknown) {
		if (response && typeof response === 'object' && !Array.isArray(response)) {
			const container = response as Record<string, unknown>;
			const school = container['school'] ?? container['data'] ?? container['result'] ?? response;

			return this._normalizeSchool(school);
		}

		return this._normalizeSchool(response);
	}

	private _normalizeSchool(item: unknown): School {
		const source = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
		const rawSourceData = source['data'];
		const rawData = rawSourceData && typeof rawSourceData === 'object'
			? (rawSourceData as Record<string, unknown>)
			: source;

		return {
			_id: this._stringValue(source['_id']) || this._stringValue(source['id']) || '',
			data: {
				...rawData,
				title:
					this._stringValue(rawData['title'])
					|| this._stringValue(rawData['name'])
					|| 'Без назви',
				description:
					this._stringValue(rawData['description'])
					|| this._stringValue(rawData['notes'])
					|| '',
				shortName: this._stringValue(rawData['shortName']),
				type: this._stringValue(rawData['type']),
				address: this._stringValue(rawData['address']),
				principal: this._stringValue(rawData['principal']),
				phone: this._stringValue(rawData['phone']),
				email: this._stringValue(rawData['email']),
				website: this._stringValue(rawData['website']),
				studentsCount: this._numberValue(rawData['studentsCount']),
				published: this._booleanValue(rawData['published'], true),
				featured: this._booleanValue(rawData['featured'], false),
				courses: this._stringArray(rawData['courses']),
				lessons: this._stringArray(rawData['lessons']),
			},
		};
	}

	private _stringValue(value: unknown) {
		return typeof value === 'string' ? value.trim() : '';
	}

	private _numberValue(value: unknown) {
		return typeof value === 'number' && Number.isFinite(value) ? value : 0;
	}

	private _booleanValue(value: unknown, fallback: boolean) {
		return typeof value === 'boolean' ? value : fallback;
	}

	private _stringArray(value: unknown) {
		if (!Array.isArray(value)) {
			return [];
		}

		return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
	}

	private _handleError(error: HttpErrorResponse) {
		const message = error.error instanceof ErrorEvent
			? error.error.message
			: `Request failed with status ${error.status}`;

		return throwError(() => new Error(message));
	}
}
