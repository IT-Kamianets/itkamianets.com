import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Item, NewsItem } from '../../feature/item/item.interface';
import { ItemService } from '../../feature/item/item.service';

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrl: './news.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
	private readonly itemService = inject(ItemService);

	readonly categories = ['All', 'Events', 'Updates', 'Articles'] as const;
	activeFilter = signal<string>('All');
	readonly newsItems = signal<NewsItem[]>([]);

	constructor() {
		this.loadNews();
	}

	setFilter(filter: string): void {
		this.activeFilter.set(filter);
	}

	get filteredNews(): NewsItem[] {
		const f = this.activeFilter();
		const items = this.newsItems();
		if (f === 'All') return items;
		return items.filter((n) => n.category === f.toLowerCase());
	}

	getCategoryLabel(cat: string): string {
		switch (cat) {
			case 'events':
				return 'Подія';
			case 'updates':
				return 'Оновлення';
			case 'articles':
				return 'Стаття';
			default:
				return cat;
		}
	}

	private loadNews(): void {
		this.itemService.get().subscribe({
			next: (items) => {
				this.newsItems.set(this.mapNewsItems(items));
			},
			error: () => {
				this.newsItems.set([]);
			},
		});
	}

	private mapNewsItems(items: Item[]): NewsItem[] {
		return items
			.map((item) => this.toNewsItem(item))
			.filter((item): item is NewsItem => Boolean(item));
	}

	private toNewsItem(item: Item): NewsItem | null {
		const data = this.asRecord(item.data);
		const type = this.pickString(data, ['type', 'kind', 'contentType']);
		if (type && type !== 'news') {
			return null;
		}

		const title = this.pickString(data, ['title', 'headline', 'name']);
		if (!title) {
			return null;
		}

		const summary = this.pickString(data, ['summary', 'description', 'excerpt']) ?? '';
		const image =
			this.pickString(data, ['image', 'cover', 'thumbnail', 'hero']) ?? 'logo.png';
		const date = this.pickString(data, ['date', 'publishedAt', 'createdAt']) ?? '';
		const category = this.normalizeCategory(
			this.pickString(data, ['category', 'tag']) ?? '',
		);

		return {
			_id: item._id,
			type: 'news',
			title,
			summary,
			image,
			date,
			category,
		};
	}

	private normalizeCategory(input: string): NewsItem['category'] {
		const value = input.toLowerCase().trim();
		if (value === 'events') return 'events';
		if (value === 'articles') return 'articles';
		return 'updates';
	}

	private asRecord(value: unknown): Record<string, unknown> {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			return {};
		}

		return value as Record<string, unknown>;
	}

	private pickString(source: Record<string, unknown>, keys: string[]): string | null {
		for (const key of keys) {
			const value = source[key];
			if (typeof value === 'string' && value.trim().length) {
				return value.trim();
			}
		}

		return null;
	}
}

