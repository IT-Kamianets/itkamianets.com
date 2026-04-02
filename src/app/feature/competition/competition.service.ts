import { Injectable, inject } from '@angular/core';
import { HttpService } from 'wacom';
import { Competition } from './competition.interface';

@Injectable({
	providedIn: 'root',
})
export class CompetitionService {
	private readonly _http = inject(HttpService);

	private readonly _endpoint = '/api/itcompetition';

	getAll() {
		return new Promise<Competition[]>((resolve) => {
			this._http.get(`${this._endpoint}/get`, (resp: unknown) => {
				resolve(this._toArray(this._unwrapListResponse(resp)));
			}, {
				err: () => resolve([]),
			});
		});
	}

	fetchById(_id: string) {
		return new Promise<Competition | null>((resolve) => {
			this._http.post(`${this._endpoint}/fetch`, { _id }, (resp: unknown) => {
				resolve(this._toCompetition(this._unwrapDocResponse(resp)));
			}, {
				err: () => resolve(null),
			});
		});
	}

	create(data: Record<string, unknown>) {
		return new Promise<Competition | null>((resolve) => {
			this._http.post(`${this._endpoint}/create`, { data }, (resp: unknown) => {
				resolve(this._toCompetition(this._unwrapDocResponse(resp)));
			}, {
				err: () => resolve(null),
			});
		});
	}

	update(_id: string, data: Record<string, unknown>) {
		return new Promise<Competition | null>((resolve) => {
			this._http.post(`${this._endpoint}/update`, { _id, data }, (resp: unknown) => {
				resolve(this._toCompetition(this._unwrapDocResponse(resp)));
			}, {
				err: () => resolve(null),
			});
		});
	}

	delete(_id: string) {
		return new Promise<boolean>((resolve) => {
			this._http.post(`${this._endpoint}/delete`, { _id }, () => {
				resolve(true);
			}, {
				err: () => resolve(false),
			});
		});
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

	private _toArray(resp: unknown) {
		if (!Array.isArray(resp)) {
			return [];
		}

		return resp.map((item) => this._toCompetition(item)).filter((item): item is Competition => !!item);
	}

	private _toCompetition(item: unknown) {
		if (!item || typeof item !== 'object') {
			return null;
		}

		const doc = item as Record<string, unknown>;
		const _id = this.getString(doc['_id']);
		const data = doc['data'];

		if (!_id || !data || typeof data !== 'object') {
			return null;
		}

		return {
			_id,
			data: data as Record<string, unknown>,
		};
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

		const candidates = ['data', 'doc', 'item', 'result'];
		for (const key of candidates) {
			const value = source[key];
			if (value && typeof value === 'object') {
				const entity = value as Record<string, unknown>;
				if (entity['_id'] && entity['data']) {
					return value;
				}
			}
		}

		return resp;
	}

	private getString(value: unknown) {
		return typeof value === 'string' ? value : '';
	}
}

