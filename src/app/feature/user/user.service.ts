import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'wacom';
import { NEW_USER } from './user.const';
import { User } from './user.interface';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private readonly _http = inject(HttpService);
	private readonly _router = inject(Router);
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _storageKey = 'waw_user';

	readonly user = signal<User>({ ...NEW_USER });
	readonly isAuthenticated = computed(() => Boolean(this.user()._id || this.user().token));
	readonly isAdmin = computed(() => this.user().roles.includes('admin'));

	constructor() {
		if (!isPlatformBrowser(this._platformId)) {
			return;
		}

		const storedUser = localStorage.getItem(this._storageKey);
		if (!storedUser) {
			return;
		}

		try {
			const user = JSON.parse(storedUser) as User;
			if (user.token) {
				this._http.set('token', user.token);
			}
			this.setUser(user);
		} catch {
			localStorage.removeItem(this._storageKey);
		}
	}

	new(): User {
		return { ...NEW_USER };
	}

	setUser(user: User) {
		const nextUser = {
			...NEW_USER,
			...user,
			data: user.data || {},
			is: user.is || {},
			roles: user.roles || [],
		};

		this.user.set(nextUser);

		if (nextUser.token) {
			this._http.set('token', nextUser.token);
		}

		if (isPlatformBrowser(this._platformId)) {
			localStorage.setItem(this._storageKey, JSON.stringify(nextUser));
		}
	}

	clearUser() {
		this.user.set(this.new());
		this._http.remove('token');

		if (isPlatformBrowser(this._platformId)) {
			localStorage.removeItem(this._storageKey);
		}
	}

	logout(redirectTo = '/sign') {
		this.clearUser();
		this._http.get('/api/user/logout', undefined, {
			err: () => undefined,
		});
		this._router.navigateByUrl(redirectTo);
	}
}
