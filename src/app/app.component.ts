import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as champions from 'champions';
import { ThemeService } from 'wacom';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	template: '<router-outlet />',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	private _themeService = inject(ThemeService);

	constructor() {
		console.log(champions);

		this._themeService.init();
	}
}
