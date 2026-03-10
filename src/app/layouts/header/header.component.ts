import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeMode, ThemeService } from 'wacom';

@Component({
	selector: 'app-header',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	protected readonly theme = inject(ThemeService);

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
}
