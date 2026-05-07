import { Injectable, inject } from '@angular/core';
import { HttpService } from '@wawjs/ngx-http';
import { firstValueFrom, from, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { Competition, CompetitionData } from './competition.interface';

@Injectable({
	providedIn: 'root',
})
export class CompetitionService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);

	private readonly _endpoint = '/api/itcompetition';
	private _tokenInBody() {
		return this._userService.user().token?.trim() || '';
	}

	private _syncToken() {
		const token = this._userService.user().token?.trim() || '';
		if (token) {
			this._http.set('token', token);
		} else {
			this._http.remove('token');
		}
	}

	getAll() {
		this._syncToken();
		return firstValueFrom(
			this._http.get(`${this._endpoint}/get?_=${Date.now()}`).pipe(
				map((resp: unknown) => this._toArray(this._unwrapListResponse(resp))),
				catchError(() => of([] as Competition[])),
			),
		);
	}

	fetchById(_id: string) {
		this._syncToken();
		const token = this._tokenInBody();
		return firstValueFrom(
			this._http
				.post(`${this._endpoint}/fetch`, token ? { _id, id: _id, token } : { _id, id: _id })
				.pipe(
					map((resp: unknown) => this._toCompetition(this._unwrapDocResponse(resp))),
					catchError(() => of(null)),
				),
		);
	}

	create(data: CompetitionData) {
		this._syncToken();
		const token = this._tokenInBody();
		return firstValueFrom(
			this._http.post(`${this._endpoint}/create`, token ? { data, token } : { data }).pipe(
				map((resp: unknown) =>
					this._toCompetitionOrFallback(this._unwrapDocResponse(resp), undefined, data),
				),
				catchError(() => of(null)),
			),
		);
	}

	update(_id: string, data: CompetitionData) {
		this._syncToken();
		const token = this._tokenInBody();
		return firstValueFrom(
			this._http
				.post(
					`${this._endpoint}/update`,
					token ? { _id, id: _id, data, token } : { _id, id: _id, data },
				)
				.pipe(
					mergeMap((resp: unknown) => {
						// Якщо бекенд повертає ok/success=false (але HTTP 200), не робимо вигляд що все збереглось.
						if (!this._isOkResponse(resp)) {
							const details = this._apiMessage(resp) || this._stringifySafe(resp);
							return throwError(
								() =>
									new Error(
										details
											? `Update відхилено API: ${details}`
											: 'Update відхилено API.',
									),
							);
						}

						// Найнадійніше — підтягнути актуальний документ після update.
						return from(this.fetchById(_id));
					}),
					catchError((err: unknown) => {
						const message = this._httpErrorMessage(err);
						return throwError(() => new Error(message));
					}),
				),
		);
	}

	delete(_id: string) {
		this._syncToken();
		const token = this._tokenInBody();
		return firstValueFrom(
			this._http
				.post(
					`${this._endpoint}/delete`,
					token ? { _id, id: _id, token } : { _id, id: _id },
				)
				.pipe(
					mergeMap((resp: unknown) => {
						// Якщо HTTP 200, але тіло порожнє (undefined/null) — вважаємо успіхом.
						// Бекенд часто не повертає payload для delete.
						if (resp === undefined || resp === null) {
							return of(true);
						}

						if (!this._isOkResponse(resp)) {
							const details = this._apiMessage(resp) || this._stringifySafe(resp);
							return throwError(
								() =>
									new Error(
										details
											? `Delete відхилено API: ${details}`
											: 'Delete відхилено API.',
									),
							);
						}

						return of(true);
					}),
					catchError((err: unknown) => {
						const message = this._httpErrorMessage(err);
						return throwError(() => new Error(message));
					}),
				),
		);
	}

	isActive(competition: Competition) {
		const data = competition.data || {};
		const status = this.getString(data['status'])?.toLowerCase();
		const explicitFlag = data['active'];

		if (typeof explicitFlag === 'boolean') {
			return explicitFlag;
		}

		return status === 'active' || status === 'published' || status === 'ongoing';
	}

	getTitle(competition: Competition) {
		const rawTitle =
			this.getString(competition.data['title']) ||
			this.getString(competition.data['name']) ||
			'';

		if (!rawTitle) {
			return 'Змагання';
		}

		const technicalTitlePattern = /^competition\s+[a-f0-9]{24}$/i;
		if (technicalTitlePattern.test(rawTitle.trim())) {
			return 'Змагання';
		}

		return rawTitle;
	}

	// NOTE: _resolveAfterUpdate був “розумним”, але робив UX гіршим і маскував реальні відповіді API.

	private _toArray(resp: unknown) {
		if (!Array.isArray(resp)) {
			return [];
		}

		return resp
			.map((item) => this._toCompetition(item))
			.filter((item): item is Competition => !!item);
	}

	private _toCompetition(item: unknown) {
		if (!item || typeof item !== 'object') {
			return null;
		}

		const doc = item as Record<string, unknown>;
		const _id = this.getString(doc['_id']) || this.getString(doc['id']);
		const nested = doc['data'];

		if (_id && nested && typeof nested === 'object') {
			return {
				_id,
				data: nested as CompetitionData,
			};
		}

		if (_id) {
			const rest: Record<string, unknown> = { ...doc };
			delete rest['_id'];
			delete rest['id'];
			delete rest['data'];
			if (Object.keys(rest).length > 0) {
				return {
					_id,
					data: rest as CompetitionData,
				};
			}
		}

		return null;
	}

	private _toCompetitionOrFallback(
		item: unknown,
		fallbackId?: string,
		fallbackData?: CompetitionData,
	) {
		const parsed = this._toCompetition(item);
		if (parsed) {
			return parsed;
		}

		const fromItem = this._syntheticFromBareResponse(item, fallbackId, fallbackData);
		if (fromItem) {
			return fromItem;
		}

		if (fallbackId && fallbackData) {
			return { _id: fallbackId, data: fallbackData };
		}

		return null;
	}

	private _syntheticFromBareResponse(
		item: unknown,
		fallbackId?: string,
		fallbackData?: CompetitionData,
	) {
		if (!item || typeof item !== 'object') {
			return null;
		}

		const source = item as Record<string, unknown>;
		const _id =
			this.getString(source['_id']) || this.getString(source['id']) || (fallbackId ?? '');

		if (!_id || !fallbackData) {
			return null;
		}

		const keys = Object.keys(source).filter(
			(k) => !['_id', 'id', 'ok', 'success', 'message', 'status'].includes(k),
		);
		if (keys.length === 0) {
			return { _id, data: fallbackData };
		}

		return null;
	}

	private _unwrapListResponse(resp: unknown): unknown {
		if (Array.isArray(resp)) {
			return resp;
		}

		if (!resp || typeof resp !== 'object') {
			return [];
		}

		const source = resp as Record<string, unknown>;
		const candidates = ['data', 'docs', 'items', 'list', 'result'];
		for (const key of candidates) {
			const value = source[key];
			if (Array.isArray(value)) {
				return value;
			}
		}

		return [];
	}

	private _unwrapDocResponse(resp: unknown): unknown {
		if (!resp || typeof resp !== 'object') {
			return resp;
		}

		const source = resp as Record<string, unknown>;
		if (source['_id'] && source['data']) {
			return source;
		}

		const candidates = [
			'data',
			'doc',
			'item',
			'result',
			'document',
			'updated',
			'record',
			'competition',
		];
		for (const key of candidates) {
			const value = source[key];
			if (value && typeof value === 'object') {
				const entity = value as Record<string, unknown>;
				if (entity['_id'] && entity['data']) {
					return value;
				}
				if (entity['_id'] || entity['id']) {
					return value;
				}
			}
		}

		return resp;
	}

	private getString(value: unknown) {
		return typeof value === 'string' ? value : '';
	}

	private _apiMessage(resp: unknown) {
		if (!resp || typeof resp !== 'object') {
			return '';
		}
		const o = resp as Record<string, unknown>;
		const message = typeof o['message'] === 'string' ? o['message'] : '';
		const errorText = typeof o['error'] === 'string' ? o['error'] : '';
		const error = o['error'];
		const err = o['err'];
		const errors = o['errors'];
		if (error && typeof error === 'object') {
			const eo = error as Record<string, unknown>;
			const inner = typeof eo['message'] === 'string' ? eo['message'] : '';
			return inner || message || errorText;
		}
		if (err && typeof err === 'object') {
			const eo = err as Record<string, unknown>;
			const inner = typeof eo['message'] === 'string' ? eo['message'] : '';
			return inner || message || errorText;
		}
		if (typeof errors === 'string' && errors) {
			return errors;
		}
		return message || errorText;
	}

	private _isOkResponse(resp: unknown) {
		if (resp === true) {
			return true;
		}
		if (resp === false) {
			return false;
		}
		if (typeof resp !== 'object') {
			// Деякі бекенди повертають рядок/число при успіху.
			return true;
		}

		const o = resp as Record<string, unknown>;
		const ok = o['ok'];
		const success = o['success'];

		if (typeof ok === 'boolean') {
			return ok;
		}
		if (typeof ok === 'number') {
			return ok > 0;
		}
		if (typeof ok === 'string') {
			if (ok.toLowerCase() === 'false') {
				return false;
			}
			if (ok.toLowerCase() === 'true') {
				return true;
			}
		}
		if (typeof success === 'boolean') {
			return success;
		}
		if (typeof success === 'number') {
			return success > 0;
		}
		if (typeof success === 'string') {
			if (success.toLowerCase() === 'false') {
				return false;
			}
			if (success.toLowerCase() === 'true') {
				return true;
			}
		}

		// Поширені патерни: { deleted: 1 } / { deletedCount: 1 }
		const deleted = o['deleted'];
		const deletedCount = o['deletedCount'];
		if (typeof deleted === 'number') {
			return deleted > 0;
		}
		if (typeof deletedCount === 'number') {
			return deletedCount > 0;
		}

		// Якщо немає явних прапорів — трактуємо як успіх (HTTP 200).
		return true;
	}

	private _stringifySafe(value: unknown) {
		try {
			return JSON.stringify(value);
		} catch {
			return String(value);
		}
	}

	private _httpErrorMessage(err: unknown) {
		if (!err || typeof err !== 'object') {
			return 'Не вдалося зберегти зміни через API.';
		}

		const e = err as Record<string, unknown>;
		const status = typeof e['status'] === 'number' ? e['status'] : null;
		const statusText = typeof e['statusText'] === 'string' ? e['statusText'] : '';
		const message =
			(typeof e['message'] === 'string' && e['message']) ||
			(status ? `HTTP ${status}${statusText ? ` ${statusText}` : ''}` : '');

		const payload = e['error'];
		if (payload && typeof payload === 'object') {
			const pe = payload as Record<string, unknown>;
			const apiMessage = typeof pe['message'] === 'string' ? pe['message'] : '';
			if (apiMessage) {
				return apiMessage;
			}
		}

		return message || 'Не вдалося зберегти зміни через API.';
	}
}
