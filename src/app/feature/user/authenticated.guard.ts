import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

export const authenticatedGuard: CanActivateFn = () => {
	const userService = inject(UserService);
	const router = inject(Router);

	return userService.isAuthenticated() ? true : router.createUrlTree(['/sign']);
};
