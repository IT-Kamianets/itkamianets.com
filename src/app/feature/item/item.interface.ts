export type ItemData = Record<string, unknown>;

export interface Item {
	_id: string;
	data: ItemData;
}

export interface ItemOptions {
	menu?: {
		exact?: boolean;
		external?: boolean;
		target?: '_self' | '_blank';
	};
	[key: string]: unknown;
}

export interface MenuItem {
	_id: string;
	type: 'menu';
	title: string;
	href: string;
	options?: ItemOptions;
}

export interface NewsItem {
	_id: string;
	type: 'news';
	title: string;
	excerpt: string;
	image: string;
	date: string;
	category: 'events' | 'updates' | 'articles';
}
