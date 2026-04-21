import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeMode, ThemeService } from '@wawjs/ngx-ui';
import { MenuItem } from '../../feature/item/item.interface';
import { UserService } from '../../feature/user/user.service';

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
	protected readonly menuItems: MenuItem[] = [
		{
			_id: 'menu-services',
			type: 'menu',
			title: 'Послуги',
			href: '/services',
		},
		{
			_id: 'menu-events',
			type: 'menu',
			title: 'Події',
			href: '/events',
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
			title: 'Наша команда',
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
}
