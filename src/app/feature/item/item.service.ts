import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
	Item,
	ItemCreatePayload,
	ItemData,
	ItemDeletePayload,
	ItemFetchPayload,
	ItemUpdatePayload,
} from './item.interface';

@Injectable({
	providedIn: 'root',
})
export class ItemService {
	private readonly _http = inject(HttpClient);
	private readonly _baseUrl = `${environment.apiUrl}/api/ititem`;

	items = signal<Item[]>(environment.items);

	create<TData extends ItemData>(payload: ItemCreatePayload<TData>) {
		return this._http.post<Item<TData>>(`${this._baseUrl}/create`, payload);
	}

	get<TData extends ItemData>() {
		return this._http.get<Item<TData>[]>(`${this._baseUrl}/get`);
	}

	fetch<TData extends ItemData>(payload: ItemFetchPayload) {
		return this._http.post<Item<TData>[]>(`${this._baseUrl}/fetch`, payload);
	}

	update<TData extends ItemData>(payload: ItemUpdatePayload<TData>) {
		return this._http.post<Item<TData>>(`${this._baseUrl}/update`, payload);
	}

	delete(payload: ItemDeletePayload) {
		return this._http.post<{ _id: string }>(`${this._baseUrl}/delete`, payload);
	}
}
