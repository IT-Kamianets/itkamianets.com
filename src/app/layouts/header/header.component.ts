import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../feature/user/user.service';
import { ThemeMode, ThemeService } from 'wacom';
import { Item, MenuItem } from '../../feature/item/item.interface';
import { ItemService } from '../../feature/item/item.service';

@Component({
	selector: 'app-public-header',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	protected readonly theme = inject(ThemeService);
	protected readonly userService = inject(UserService);
	private readonly itemService = inject(ItemService);
	protected readonly menuItems = signal<MenuItem[]>([]);

	private readonly fallbackMenuItems: MenuItem[] = [
		{
			_id: 'menu-home',
			type: 'menu',
			title: 'Головна',
			href: '/',
			options: { menu: { exact: true } },
		},
		{
			_id: 'menu-proposals',
			type: 'menu',
			title: 'Послуги',
			href: '/proposals',
		},
		{
			_id: 'menu-hackathons',
			type: 'menu',
			title: 'Змагання',
			href: '/hackathons',
		},
		{
			_id: 'menu-projects',
			type: 'menu',
			title: 'Проєкти',
			href: '/projects',
		},
		{
			_id: 'menu-team',
			type: 'menu',
			title: 'Команда',
			href: '/team',
		},
		{
			_id: 'menu-news',
			type: 'menu',
			title: 'Новини',
			href: '/news',
		},
		{
			_id: 'menu-merch',
			type: 'menu',
			title: 'Мерч',
			href: '/merch',
		},
	];

	constructor() {
		this.loadMenuItems();
	}

	protected toggleTheme() {
		const newMode: ThemeMode = this.theme.mode() === 'dark' ? 'light' : 'dark';
		this.theme.setMode(newMode);
	}

	protected get isDark(): boolean {
		return this.theme.mode() === 'dark';
	}

	protected get themeIcon(): string {
		return this.isDark ? 'light_mode' : 'dark_mode';
	}

	protected get themeLabel(): string {
		return this.isDark ? 'Switch to light mode' : 'Switch to dark mode';
	}

	protected get profileLabel(): string {
		return this.userService.isAuthenticated() ? 'Open profile' : 'Sign in';
	}

	private loadMenuItems(): void {
		this.itemService.get().subscribe({
			next: (items) => {
				const menuItems = this.mapMenuItems(items);
				this.menuItems.set(menuItems.length ? menuItems : this.fallbackMenuItems);
			},
			error: () => {
				this.menuItems.set(this.fallbackMenuItems);
			},
		});
	}

	private mapMenuItems(items: Item[]): MenuItem[] {
		return items
			.map((item) => this.toMenuItem(item))
			.filter((item): item is MenuItem => Boolean(item))
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	}

	private toMenuItem(item: Item): MenuItem | null {
		const data = this.asRecord(item.data);
		const type = this.pickString(data, ['type', 'kind', 'category']);
		const menuConfig = this.pickRecord(data, ['menu', 'options']);
		const menuOptions = this.pickRecord(menuConfig, ['menu']);

		if (type && type !== 'menu' && !Object.keys(menuOptions).length) {
			return null;
		}

		const title = this.pickString(data, ['title', 'label', 'name', 'text']);
		const href = this.pickString(data, ['href', 'url', 'path', 'link']);
		if (!title || !href) {
			return null;
		}

		const order = this.pickNumber(data, ['order', 'sort', 'position']);
		const exact = this.pickBoolean(menuOptions, ['exact']);
		const external = this.pickBoolean(menuOptions, ['external']);
		const target = this.pickString(menuOptions, ['target']);

		return {
			_id: item._id,
			type: 'menu',
			title,
			href,
			order: order ?? undefined,
			options: {
				menu: {
					exact: exact ?? undefined,
					external: external ?? undefined,
					target: target === '_blank' || target === '_self' ? target : undefined,
				},
			},
		};
	}

	private asRecord(value: unknown): Record<string, unknown> {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			return {};
		}

		return value as Record<string, unknown>;
	}

	private pickRecord(
		source: Record<string, unknown>,
		keys: string[],
	): Record<string, unknown> {
		for (const key of keys) {
			const candidate = source[key];
			if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
				return candidate as Record<string, unknown>;
			}
		}

		return {};
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

	private pickNumber(source: Record<string, unknown>, keys: string[]): number | null {
		for (const key of keys) {
			const value = source[key];
			if (typeof value === 'number' && Number.isFinite(value)) {
				return value;
			}
		}

		return null;
	}

	private pickBoolean(source: Record<string, unknown>, keys: string[]): boolean | null {
		for (const key of keys) {
			const value = source[key];
			if (typeof value === 'boolean') {
				return value;
			}
		}

		return null;
	}
}
