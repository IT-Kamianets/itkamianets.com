import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class ReviewsService {
	private readonly _http = inject(HttpClient);
	private readonly _userService = inject(UserService);
	private readonly _basePath = 'https://api.webart.work/api/itreview';

	getReviews<T = unknown>() {
		return this._request<T>('getReviews', this._http.get(`${this._basePath}/get`, { headers: this._headers() }));
	}

	fetchReview<T = unknown>(id: string) {
		return this._request<T>(
			'fetchReview',
			this._http.post(`${this._basePath}/fetch`, { _id: id }, { headers: this._headers() }),
		);
	}

	createReview<T = unknown, D = unknown>(data: D) {
		return this._mutationRequest<T>(
			'createReview',
			this._http.post(`${this._basePath}/create`, data, { headers: this._headers() }),
		);
	}

	updateReview<T = unknown, D = unknown>(id: string, data: D) {
		return this._mutationRequest<T>(
			'updateReview',
			this._http.post(
				`${this._basePath}/update`,
				{
					_id: id,
					...((data as object) || {}),
				},
				{ headers: this._headers() },
			),
		);
	}

	deleteReview<T = unknown>(id: string) {
		return this._mutationRequest<T>(
			'deleteReview',
			this._http.post(`${this._basePath}/delete`, { _id: id }, { headers: this._headers() }),
		);
	}

	private _headers() {
		const token = this._userService.user().token?.trim() || '';
		let headers = new HttpHeaders();

		if (token) {
			headers = headers.set('token', token);
		}

		return headers;
	}

	private _request<T>(methodName: string, request$: ReturnType<HttpClient['get']>) {
		return firstValueFrom(
			request$.pipe(
				map((response: unknown) => response as T),
				catchError((error) => {
					console.error(`Reviews API ${methodName} failed:`, this._formatError(error));
					return of(null);
				}),
			),
		);
	}

	private _mutationRequest<T>(methodName: string, request$: ReturnType<HttpClient['post']>) {
		return firstValueFrom(
			request$.pipe(
				map((response: unknown) => (response ?? true) as T),
				catchError((error) => {
					console.error(`Reviews API ${methodName} failed:`, this._formatError(error));
					return of(null);
				}),
			),
		);
	}

	private _formatError(error: unknown) {
		if (!error || typeof error !== 'object') {
			return error;
		}

		const httpError = error as {
			status?: number;
			statusText?: string;
			url?: string;
			message?: string;
			error?: unknown;
		};

		return {
			status: httpError.status,
			statusText: httpError.statusText,
			url: httpError.url,
			message: httpError.message,
			error: httpError.error,
		};
	}
}
