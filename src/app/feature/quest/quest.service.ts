import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from '@wawjs/ngx-http';
import { firstValueFrom, from, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { Quest, QuestData, QuestDocument } from './quest.interface';

@Injectable({ providedIn: 'root' })
export class QuestService {
	private readonly _http = inject(HttpService);
	private readonly _userService = inject(UserService);
	private readonly _endpoint = '/api/itquest';

	private readonly _quests = signal<Quest[]>([]);
	readonly quests = this._quests.asReadonly();

	private _tokenInBody() {
		return this._userService.user().token?.trim() || '';
	}

	private _syncToken() {
		const token = this._tokenInBody();
		if (token) {
			this._http.set('token', token);
		} else {
			this._http.remove('token');
		}
	}

	async loadAll() {
		this._syncToken();
		const quests = await firstValueFrom(
			this._http.get(`${this._endpoint}/get?_=${Date.now()}`).pipe(
				map((resp: unknown) => this._toArray(this._unwrapListResponse(resp))),
				catchError(() => of([] as Quest[])),
			),
		);
		this._quests.set(quests);
		return quests;
	}

	fetchById(_id: string) {
		this._syncToken();
		const token = this._tokenInBody();
		return firstValueFrom(
			this._http
				.post(`${this._endpoint}/fetch`, token ? { _id, id: _id, token } : { _id, id: _id })
				.pipe(
					map((resp: unknown) => this._toQuest(this._unwrapDocResponse(resp))),
					catchError(() => of(null)),
				),
		);
	}

	create(data: QuestData) {
		this._syncToken();
		const token = this._tokenInBody();
		return firstValueFrom(
			this._http.post(`${this._endpoint}/create`, token ? { data, token } : { data }).pipe(
				map((resp: unknown) => this._toQuestOrFallback(this._unwrapDocResponse(resp), undefined, data)),
				catchError((err: unknown) => throwError(() => new Error(this._httpErrorMessage(err)))),
			),
		);
	}

	update(_id: string, data: QuestData) {
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
						if (!this._isOkResponse(resp)) {
							const details = this._apiMessage(resp) || this._stringifySafe(resp);
							return throwError(
								() =>
									new Error(
										details
											? `Update rejected by API: ${details}`
											: 'Update rejected by API.',
									),
							);
						}

						return from(this.fetchById(_id));
					}),
					catchError((err: unknown) => throwError(() => new Error(this._httpErrorMessage(err)))),
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
						if (resp === undefined || resp === null) {
							return of(true);
						}

						if (!this._isOkResponse(resp)) {
							const details = this._apiMessage(resp) || this._stringifySafe(resp);
							return throwError(
								() =>
									new Error(
										details
											? `Delete rejected by API: ${details}`
											: 'Delete rejected by API.',
									),
							);
						}

						return of(true);
					}),
					catchError((err: unknown) => throwError(() => new Error(this._httpErrorMessage(err)))),
				),
		);
	}

	isActive(quest: QuestDocument) {
		const data = quest.data || {};
		const explicitFlag = data['active'];
		const status = this._getString(data['status']).toLowerCase();

		if (typeof explicitFlag === 'boolean') {
			return explicitFlag;
		}

		if (typeof data['published'] === 'boolean') {
			return data['published'];
		}

		return status === 'active' || status === 'published' || status === 'ongoing';
	}

	private _toArray(resp: unknown) {
		if (!Array.isArray(resp)) {
			return [];
		}

		return resp.map((item) => this._toQuest(item)).filter((item): item is Quest => !!item);
	}

	private _toQuest(item: unknown) {
		if (!item || typeof item !== 'object') {
			return null;
		}

		const doc = item as Record<string, unknown>;
		const _id = this._getString(doc['_id']) || this._getString(doc['id']);
		if (!_id) {
			return null;
		}

		const nested = doc['data'];
		const data =
			nested && typeof nested === 'object'
				? (nested as QuestData)
				: this._stripMeta(doc);

		return {
			_id,
			title: this._pickString(data, ['title', 'name']) || 'Quest',
			category: this._pickString(data, ['category', 'type']),
			shortDescription: this._pickString(data, ['shortDescription', 'summary']),
			description: this._pickString(data, ['description', 'about']),
			difficulty: this._pickString(data, ['difficulty', 'level']),
			reward: this._pickString(data, ['reward', 'prize']),
			duration: this._pickString(data, ['duration']),
			format: this._pickString(data, ['format']),
			active: this.isActive({ _id, data }),
			link: this._pickString(data, ['link', 'url']),
			curator: this._pickString(data, ['curator', 'mentor']),
			location: this._pickString(data, ['location', 'place', 'venue']),
			rawData: { ...data },
		};
	}

	private _toQuestOrFallback(item: unknown, fallbackId?: string, fallbackData?: QuestData) {
		const parsed = this._toQuest(item);
		if (parsed) {
			return parsed;
		}

		const source = item && typeof item === 'object' ? (item as Record<string, unknown>) : null;
		const _id =
			(source ? this._getString(source['_id']) || this._getString(source['id']) : '') ||
			fallbackId ||
			'';

		if (!_id || !fallbackData) {
			return null;
		}

		return this._toQuest({ _id, data: fallbackData });
	}

	private _pickString(data: QuestData, keys: (keyof QuestData)[]) {
		for (const key of keys) {
			const value = data[key];
			if (typeof value === 'string' && value.trim()) {
				return value.trim();
			}
		}

		return '';
	}

	private _unwrapListResponse(resp: unknown): unknown {
		if (Array.isArray(resp)) {
			return resp;
		}

		if (!resp || typeof resp !== 'object') {
			return [];
		}

		const source = resp as Record<string, unknown>;
		for (const key of ['data', 'docs', 'items', 'list', 'result']) {
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

		for (const key of ['data', 'doc', 'item', 'result', 'document', 'updated', 'record', 'quest']) {
			const value = source[key];
			if (value && typeof value === 'object') {
				return value;
			}
		}

		return resp;
	}

	private _isOkResponse(resp: unknown) {
		if (resp === true) {
			return true;
		}
		if (resp === false) {
			return false;
		}
		if (!resp || typeof resp !== 'object') {
			return true;
		}

		const source = resp as Record<string, unknown>;
		for (const key of ['ok', 'success']) {
			const value = source[key];
			if (typeof value === 'boolean') {
				return value;
			}
			if (typeof value === 'number') {
				return value > 0;
			}
			if (typeof value === 'string') {
				if (value.toLowerCase() === 'true') {
					return true;
				}
				if (value.toLowerCase() === 'false') {
					return false;
				}
			}
		}

		if (typeof source['deleted'] === 'number') {
			return source['deleted'] > 0;
		}
		if (typeof source['deletedCount'] === 'number') {
			return source['deletedCount'] > 0;
		}

		return true;
	}

	private _apiMessage(resp: unknown) {
		if (!resp || typeof resp !== 'object') {
			return '';
		}

		const source = resp as Record<string, unknown>;
		const message = typeof source['message'] === 'string' ? source['message'] : '';
		const errorText = typeof source['error'] === 'string' ? source['error'] : '';
		return message || errorText;
	}

	private _httpErrorMessage(err: unknown) {
		if (!err || typeof err !== 'object') {
			return 'Failed to complete the API request.';
		}

		const error = err as Record<string, unknown>;
		const payload = error['error'];
		if (payload && typeof payload === 'object') {
			const apiMessage = (payload as Record<string, unknown>)['message'];
			if (typeof apiMessage === 'string' && apiMessage) {
				return apiMessage;
			}
		}

		const message = error['message'];
		if (typeof message === 'string' && message) {
			return message;
		}

		const status = typeof error['status'] === 'number' ? error['status'] : null;
		const statusText = typeof error['statusText'] === 'string' ? error['statusText'] : '';
		return status
			? `HTTP ${status}${statusText ? ` ${statusText}` : ''}`
			: 'Failed to complete the API request.';
	}

	private _stripMeta(source: Record<string, unknown>) {
		const data: QuestData = {};
		for (const [key, value] of Object.entries(source)) {
			if (!['_id', 'id', 'data', 'ok', 'success', 'message', 'status'].includes(key)) {
				data[key] = value;
			}
		}
		return data;
	}

	private _stringifySafe(value: unknown) {
		try {
			return JSON.stringify(value);
		} catch {
			return String(value);
		}
	}

	private _getString(value: unknown) {
		return typeof value === 'string' ? value : '';
	}
}
