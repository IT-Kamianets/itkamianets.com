import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeMode, ThemeService } from 'wacom';
import { UserService } from '../../feature/user/user.service';

@Component({
	selector: 'app-manage-header',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './manage-header.component.html',
	styleUrl: './manage-header.component.scss',
})
export class ManageHeaderComponent {
	protected readonly theme = inject(ThemeService);
	protected readonly userService = inject(UserService);

	protected toggleTheme() {
		const newMode: ThemeMode = this.theme.mode() === 'dark' ? 'light' : 'dark';
		this.theme.setMode(newMode);
	}

	protected logout() {
		this.userService.logout('/sign');
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
}
