import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, pattern, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from 'wacom';
import { ThemeMode, ThemeService } from 'wacom';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { UserService } from '../../feature/user/user.service';
import { RespStatus, SignModel } from './sign.interface';

@Component({
	imports: [RouterLink, InputText, ButtonDirective, FormField],
	templateUrl: './sign.component.html',
	styleUrl: './sign.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignComponent {
	protected readonly theme = inject(ThemeService);
	protected readonly userService = inject(UserService);
	private readonly _http = inject(HttpService);
	private readonly _router = inject(Router);
	protected readonly model = signal<SignModel>({
		email: '',
		password: '',
	});
	protected readonly submitMessage = signal('');
	protected readonly submitTone = signal<'info' | 'error'>('info');
	protected readonly signForm = form(this.model, (s) => {
		required(s.email, { message: 'Введіть email.' });
		pattern(s.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
			message: 'Введіть коректну email-адресу.',
		});
		required(s.password, { message: 'Введіть пароль.' });
	});

	protected async onSubmit(event: Event): Promise<void> {
		event.preventDefault();
		await submit(this.signForm, async (field) => this._submit(field().value()));
	}

	protected toggleTheme() {
		const newMode: ThemeMode = this.theme.mode() === 'dark' ? 'light' : 'dark';
		this.theme.setMode(newMode);
	}

	protected get isDark(): boolean {
		return this.theme.mode() === 'dark';
	}

	private _submit(payload: SignModel) {
		this._http.post(
			'/api/user/status?test=test',
			payload,
			(resp: RespStatus) => {
				if (resp?.email && resp?.pass) {
					this._login(payload);
				} else {
					this._sign(payload);
				}
			},
			{
				err: () => this._setStatus('error', 'Не вдалося звʼязатися з API авторизації.'),
			},
		);
	}

	private _login(payload: SignModel) {
		this._http.post('/api/user/login', payload, (user: any) => this._set(user), {
			err: () => this._setStatus('error', 'Не вдалося увійти.'),
		});
	}

	private _sign(payload: SignModel) {
		this._http.post('/api/user/sign', payload, (user: any) => this._set(user), {
			err: () => this._setStatus('error', 'Не вдалося зареєструватися.'),
		});
	}

	private _set(user: unknown) {
		if (!user || typeof user !== 'object') {
			this._setStatus('error', 'Щось пішло не так.');
			return;
		}

		this.userService.setUser(user as Parameters<UserService['setUser']>[0]);
		this._router.navigateByUrl('/manage/profile');
	}

	private _setStatus(tone: 'info' | 'error', message: string) {
		this.submitTone.set(tone);
		this.submitMessage.set(message);
	}
}
