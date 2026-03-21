import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService, ThemeService } from 'wacom';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	template: '<router-outlet />',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	private _themeService = inject(ThemeService);
	private _httpService = inject(HttpService);

	constructor() {
		this._themeService.init();

		this._httpService.get('/api/itproject/get').subscribe((projects) => {
			console.log(projects);
		});
	}
}
