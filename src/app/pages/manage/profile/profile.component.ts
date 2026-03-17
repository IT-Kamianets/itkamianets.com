import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../feature/user/user.service';

@Component({
	imports: [RouterLink],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
	protected readonly userService = inject(UserService);
	protected readonly user = this.userService.user;
	protected readonly displayName = computed(() => {
		const user = this.user();
		return user.name || user.email || 'User';
	});
}
