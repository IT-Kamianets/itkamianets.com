export type ItemType =
	| 'menu'
	| 'gallery'
	| 'news'
	| 'landing'
	| 'job'
	| 'merch'
	| 'other';

export interface ItemPricingOptions {
	price?: number;
	priceFrom?: number;
	priceTo?: number;
	currency?: string;
}

export interface ItemInventoryOptions {
	quantity?: number;
	unit?: string;
}

export interface ItemOptions {
	pricing?: ItemPricingOptions;
	inventory?: ItemInventoryOptions;
	menu?: {
		exact?: boolean;
		external?: boolean;
		target?: '_self' | '_blank';
	};
	gallery?: {
		alt?: string;
		caption?: string;
	};
	news?: {
		category?: string;
		date?: string;
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
	excerpt: string;
	date: string;
	category: 'events' | 'updates' | 'articles';
}

export interface LandingItem extends ItemBase {
	type: 'landing';
}

export interface Item extends ItemBase {}
