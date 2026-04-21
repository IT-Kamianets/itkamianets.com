import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, pattern, required, submit } from '@angular/forms/signals';
import { HttpService } from '@wawjs/ngx-http';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { UserService } from '../../../feature/user/user.service';
import { ProfileFormModel, ProfilePayload } from './profile.type';

@Component({
	imports: [FormField, InputText, Textarea, ButtonDirective],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
	protected readonly userService = inject(UserService);
	private readonly _http = inject(HttpService);

	protected readonly isFetching = signal(false);
	protected readonly isSaving = signal(false);
	protected readonly submitTone = signal<'success' | 'error' | 'info'>('info');
	protected readonly submitMessage = signal('');

	protected readonly model = signal<ProfileFormModel>({
		name: this.userService.user().name || '',
		phone: this.userService.user().phone || '',
		bio: this.userService.user().bio || '',
	});

	protected readonly profileForm = form(this.model, (p) => {
		required(p.name, { message: 'Вкажіть імʼя.' });
		minLength(p.name, 2, { message: 'Імʼя має містити щонайменше 2 символи.' });
		required(p.phone, { message: 'Вкажіть телефон.' });
		pattern(p.phone, /^[0-9+()\-\s]{7,20}$/, {
			message: 'Телефон може містити цифри, пробіли та символи +()-.',
		});
		required(p.bio, { message: 'Додайте опис.' });
		minLength(p.bio, 10, { message: 'Опис має містити щонайменше 10 символів.' });
	});

	constructor() {
		this.fetchMe();
	}

	protected async onSubmit(event: Event): Promise<void> {
		event.preventDefault();
		if (this.isSaving()) {
			return;
		}

		await submit(this.profileForm, async (field) => {
			this.isSaving.set(true);
			this.submitMessage.set('');

			const payload = field().value();
			await new Promise<void>((resolve) => {
				this._http.post(
					'/api/user/update',
					payload,
					(resp: unknown) => {
						this.applyUser(resp, payload);
						this.submitTone.set('success');
						this.submitMessage.set('Профіль оновлено.');
						this.isSaving.set(false);
						resolve();
					},
					{
						err: () => {
							this.submitTone.set('error');
							this.submitMessage.set('Не вдалося оновити профіль.');
							this.isSaving.set(false);
							resolve();
						},
					},
				);
			});
		});
	}

	private fetchMe(): void {
		this.isFetching.set(true);
		this._http.post(
			'/api/user/fetchme',
			{},
			(resp: unknown) => {
				this.isFetching.set(false);
				this.applyUser(resp);
			},
			{
				err: () => {
					this.isFetching.set(false);
					this.submitTone.set('error');
					this.submitMessage.set('Не вдалося завантажити дані профілю.');
				},
			},
		);
	}

	private applyUser(resp: unknown, fallback?: ProfileFormModel): void {
		const safeResp = resp && typeof resp === 'object' ? (resp as ProfilePayload) : {};
		const user = this.userService.user();
		const next: ProfileFormModel = {
			name: this.pickString(safeResp.name, fallback?.name, user.name),
			phone: this.pickString(safeResp.phone, fallback?.phone, user.phone),
			bio: this.pickString(safeResp.bio, fallback?.bio, user.bio),
		};

		this.model.set(next);
		this.userService.setUser({
			...user,
			...safeResp,
			...next,
		});
	}

	private pickString(...values: Array<unknown>): string {
		for (const value of values) {
			if (typeof value === 'string') {
				return value;
			}
		}

		return '';
	}
}
