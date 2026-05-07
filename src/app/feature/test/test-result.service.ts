import { Injectable, inject } from '@angular/core';
import { HttpService } from '@wawjs/ngx-http';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../user/user.service';
import { TestResult } from './test-result.interface';

@Injectable({ providedIn: 'root' })
export class TestResultService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/ittestresult';

	getAll(): Observable<TestResult[]> {
		this._syncToken();

		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: unknown) => {
				if (!Array.isArray(response)) {
					return [];
				}

				return response.map((item) => this._mapToResult(item));
			}),
			catchError(() => of([])),
		);
	}

	fetchOne(id: string): Observable<TestResult | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
			map((item: unknown) => (item ? this._mapToResult(item) : null)),
			catchError(() => of(null)),
		);
	}

	create(
		result: Omit<TestResult, '_id' | 'createdAt' | 'updatedAt'>,
	): Observable<TestResult | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/create`, this._toPayload(result)).pipe(
			map((item: unknown) => (item ? this._mapToResult(item) : null)),
			catchError(() => of(null)),
		);
	}

	update(
		id: string,
		result: Omit<TestResult, '_id' | 'createdAt' | 'updatedAt'>,
	): Observable<TestResult | null> {
		this._syncToken();

		return this._http
			.post(`${this._basePath}/update`, { _id: id, ...this._toPayload(result) })
			.pipe(
				map((item: unknown) => (item ? this._mapToResult(item) : null)),
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

	private _mapToResult(item: unknown): TestResult {
		const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
		const data =
			record['data'] && typeof record['data'] === 'object' && !Array.isArray(record['data'])
				? (record['data'] as TestResult['data'])
				: { answers: [], score: 0 };

		return {
			_id: this._stringValue(record['_id']),
			testId: this._stringValue(record['testId'] || data['testId']),
			userId: this._stringValue(record['userId'] || data['userId']),
			createdAt: this._stringValue(record['createdAt']),
			updatedAt: this._stringValue(record['updatedAt']),
			data: {
				...data,
				answers: Array.isArray(data.answers) ? data.answers : [],
				score: typeof data.score === 'number' ? data.score : 0,
			},
		};
	}

	private _toPayload(
		result: Omit<TestResult, '_id' | 'createdAt' | 'updatedAt'>,
	): Record<string, unknown> {
		return {
			data: {
				...result.data,
				testId: result.testId,
				userId: result.userId,
			},
		};
	}

	private _stringValue(value: unknown): string {
		return typeof value === 'string' ? value : value ? String(value) : '';
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
