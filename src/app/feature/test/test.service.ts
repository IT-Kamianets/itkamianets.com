import { Injectable, inject } from '@angular/core';
import { HttpService } from '@wawjs/ngx-http';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../user/user.service';
import { Question, Test, TestData } from './test.interface';

@Injectable({ providedIn: 'root' })
export class TestService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _basePath = '/api/ittest';

	getAll(): Observable<Test[]> {
		this._syncToken();

		return this._http.get(`${this._basePath}/get`).pipe(
			map((response: unknown) => {
				if (!Array.isArray(response)) {
					return [];
				}

				return response.map((item) => this._mapToTest(item));
			}),
			catchError(() => of([])),
		);
	}

	fetchOne(id: string): Observable<Test | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/fetch`, { _id: id }).pipe(
			map((item: unknown) => (item ? this._mapToTest(item) : null)),
			catchError(() => of(null)),
		);
	}

	create(data: TestData): Observable<Test | null> {
		this._syncToken();

		return this._http.post(`${this._basePath}/create`, this._toPayload(data)).pipe(
			map((item: unknown) => (item ? this._mapToTest(item) : null)),
			catchError(() => of(null)),
		);
	}

	update(id: string, data: TestData): Observable<Test | null> {
		this._syncToken();

		return this._http
			.post(`${this._basePath}/update`, { _id: id, ...this._toPayload(data) })
			.pipe(
				map((item: unknown) => (item ? this._mapToTest(item) : null)),
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

	private _mapToTest(item: unknown): Test {
		const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
		const rawData = record['data'];
		const data =
			rawData && typeof rawData === 'object' && !Array.isArray(rawData)
				? (rawData as Record<string, unknown>)
				: {};
		const source = { ...record, ...data };

		return {
			_id: this._stringValue(record['_id']),
			createdAt: this._stringValue(record['createdAt']),
			updatedAt: this._stringValue(record['updatedAt']),
			data: {
				...data,
				title: this._stringValue(source['title']),
				description: this._stringValue(source['description']),
				questions: this._normalizeQuestions(source['questions']),
			},
		};
	}

	private _toPayload(data: TestData): Record<string, unknown> {
		return {
			data,
		};
	}

	private _normalizeQuestions(value: unknown): Question[] {
		if (!Array.isArray(value)) {
			return [];
		}

		return value.map((item) => {
			const question =
				item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
			const options = Array.isArray(question['options'])
				? question['options'].map((option) => this._stringValue(option))
				: [];
			const correct = Number(question['correct']);

			return {
				question: this._stringValue(question['question']),
				options,
				correct: Number.isInteger(correct) && correct >= 0 ? correct : 0,
			};
		});
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
