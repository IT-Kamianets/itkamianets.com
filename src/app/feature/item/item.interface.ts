export type ItemData = Record<string, unknown>;

// Backend-aligned Item shape.
export interface Item<TData extends ItemData = ItemData> {
	_id: string;
	data: TData;
}

export type ItemCreatePayload<TData extends ItemData = ItemData> = {
	data: TData;
};

export type ItemUpdatePayload<TData extends ItemData = ItemData> = {
	_id: string;
	data: TData;
};

export type ItemDeletePayload = {
	_id: string;
};

export type ItemFetchPayload = Record<string, unknown>;

// Legacy view models used by existing pages (menu/news/etc).
export type ItemType =
	| 'menu'
	| 'gallery'
	| 'news'
	| 'landing'
	| 'job'
	| 'merch'
	| 'other';

export interface ItemOptions {
	menu?: {
		exact?: boolean;
		external?: boolean;
		target?: '_self' | '_blank';
	};
	gallery?: {
		alt?: string;
		caption?: string;
	};
	landing?: {
		section?: string;
		tags?: string[];
	};
}

export interface ItemBase {
	_id: string;
	type: ItemType;
	title: string;
	summary?: string;
	image?: string;
	href?: string;
	published?: boolean;
	order?: number;
	options?: ItemOptions;
	name?: string;
}

export interface MenuItem extends ItemBase {
	type: 'menu';
	href: string;
}

export interface GalleryItem extends ItemBase {
	type: 'gallery';
	image: string;
}

export interface NewsItem extends ItemBase {
	type: 'news';
	summary: string;
	date: string;
	category: 'events' | 'updates' | 'articles';
}

export interface LandingItem extends ItemBase {
	type: 'landing';
}
