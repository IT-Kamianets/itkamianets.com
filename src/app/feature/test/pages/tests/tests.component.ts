import { isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Injector,
	PLATFORM_ID,
	inject,
	signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Test } from '../../test.interface';
import { TestService } from '../../test.service';

@Component({
	selector: 'app-tests',
	imports: [RouterLink],
	templateUrl: './tests.component.html',
	styleUrl: './tests.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsComponent {
	private readonly _injector = inject(Injector);
	private readonly _platformId = inject(PLATFORM_ID);

	readonly tests = signal<Test[]>([]);
	readonly apiError = signal('');

	constructor(title: Title, meta: Meta) {
		title.setTitle('Тести | IT-Kamianets');
		meta.updateTag({
			name: 'description',
			content: 'Список доступних тестів для перевірки навичок.',
		});
		meta.updateTag({ property: 'og:title', content: 'Тести | IT-Kamianets' });
		meta.updateTag({
			property: 'og:description',
			content: 'Список доступних тестів для перевірки навичок.',
		});
		meta.updateTag({ property: 'og:type', content: 'website' });
		if (isPlatformBrowser(this._platformId)) {
			this._loadTests();
		}
	}

	trackByTestId(index: number, test: Test): string {
		return test._id || String(index);
	}

	private _loadTests(): void {
		this._injector
			.get(TestService)
			.getAll()
			.subscribe({
				next: (tests) => {
					this.tests.set(Array.isArray(tests) ? tests : []);
					this.apiError.set('');
				},
				error: () => {
					this.tests.set([]);
					this.apiError.set('Не вдалося завантажити список тестів.');
				},
			});
	}
}
