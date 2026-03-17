import {
	ChangeDetectionStrategy,
	Component,
	computed,
	Injector,
	inject,
	PLATFORM_ID,
	signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeMode, ThemeService } from 'wacom';
import { HttpService } from 'wacom';
import { UserService } from '../../feature/user/user.service';
import { RespStatus, SignModel } from './sign.interface';

@Component({
	imports: [RouterLink],
	templateUrl: './sign.component.html',
	styleUrl: './sign.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignComponent {
	protected readonly theme = inject(ThemeService);
	protected readonly userService = inject(UserService);
	private readonly _injector = inject(Injector);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _router = inject(Router);
	protected readonly model = signal<SignModel>({
		email: '',
		password: '',
	});
	protected readonly touched = signal<Record<keyof SignModel, boolean>>({
		email: false,
		password: false,
	});
	protected readonly submitMessage = signal('');
	protected readonly submitTone = signal<'info' | 'error'>('info');
	protected readonly emailError = computed(() => {
		if (!this.touched().email) {
			return '';
		}

		const email = this.model().email.trim();
		if (!email) {
			return 'Enter your email.';
		}

		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.';
	});
	protected readonly passwordError = computed(() => {
		if (!this.touched().password) {
			return '';
		}

		return this.model().password.trim() ? '' : 'Enter your password.';
	});

	protected readonly isSubmitDisabled = computed(() => {
		return Boolean(this.emailError() || this.passwordError())
			|| !this.model().email.trim()
			|| !this.model().password.trim();
	});

	protected updateField(field: keyof SignModel, value: string) {
		this.model.update((current) => ({
			...current,
			[field]: value,
		}));
	}

	protected markTouched(field: keyof SignModel) {
		this.touched.update((current) => ({
			...current,
			[field]: true,
		}));
	}

	protected onSubmit(event: Event) {
		event.preventDefault();
		this.touched.set({
			email: true,
			password: true,
		});

		if (this.isSubmitDisabled()) {
			return;
		}

		this._submit(this.model());
	}

	protected toggleTheme() {
		const newMode: ThemeMode = this.theme.mode() === 'dark' ? 'light' : 'dark';
		this.theme.setMode(newMode);
	}

	protected get isDark(): boolean {
		return this.theme.mode() === 'dark';
	}

	private _submit(payload: SignModel) {
		const http = this._http();
		if (!http) {
			this._setStatus('error', 'Auth API is only available in the browser.');
			return;
		}

		http.post('/api/user/status?test=test', payload, (resp: RespStatus) => {
			if (resp?.email && resp?.pass) {
				this._login(payload);
			} else {
				this._sign(payload);
			}
		}, {
			err: () => this._setStatus('error', 'Unable to contact the auth API.'),
		});
	}

	private _login(payload: SignModel) {
		this._http()?.post('/api/user/login', payload, (user) => this._set(user), {
			err: () => this._setStatus('error', 'Sign in failed.'),
		});
	}

	private _sign(payload: SignModel) {
		this._http()?.post('/api/user/sign', payload, (user) => this._set(user), {
			err: () => this._setStatus('error', 'Sign up failed.'),
		});
	}

	private _set(user: unknown) {
		if (!user || typeof user !== 'object') {
			this._setStatus('error', 'Something went wrong.');
			return;
		}

		this.userService.setUser(user as Parameters<UserService['setUser']>[0]);
		this._router.navigateByUrl('/manage/profile');
	}

	private _setStatus(tone: 'info' | 'error', message: string) {
		this.submitTone.set(tone);
		this.submitMessage.set(message);
	}

	private _http(): HttpService | null {
		if (!isPlatformBrowser(this._platformId)) {
			return null;
		}

		return this._injector.get(HttpService);
	}
}
