import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-contacts',
	templateUrl: './contacts.component.html',
	styleUrl: './contacts.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule],
})
export class ContactsComponent {
	private readonly _http = inject(HttpClient);

	protected readonly submitted = signal(false);
	protected readonly loading = signal(false);
	protected readonly error = signal(false);
	protected readonly validationError = signal('');

	protected name = '';
	protected phone = '';
	protected subject = '';

	protected readonly subjects = [
		'Базовий сайт',
		'Розвиток сайту',
		'Інтернет-магазин',
		'SEO-просування',
		'Технічна підтримка',
	];

	protected onSubmit(): void {
		if (!this.phone.trim()) {
			this.validationError.set('Введіть номер телефону.');
			return;
		}
		this.validationError.set('');

		const message = [
			'Нова заявка з сайту IT-Kamianets',
			`Ім'я: ${this.name}`,
			this.phone ? `Телефон: ${this.phone}` : null,
			this.subject ? `Послуга: ${this.subject}` : null,
		]
			.filter(Boolean)
			.join('\n');

		this.loading.set(true);
		this.error.set(false);

		this._http
			.post<boolean | { error: string }>('https://it.webart.work/api/telegram/contact', {
				slug: 'itkamianets',
				message,
			})
			.subscribe({
				next: (resp) => {
					this.loading.set(false);
					if (resp === true) {
						this.submitted.set(true);
					} else {
						this.error.set(true);
					}
				},
				error: () => {
					this.loading.set(false);
					this.error.set(true);
				},
			});
	}

	protected reset(): void {
		this.submitted.set(false);
		this.error.set(false);
		this.validationError.set('');
		this.name = '';
		this.phone = '';
		this.subject = '';
	}
}
