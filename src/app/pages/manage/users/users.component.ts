import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
	protected readonly adminService = inject(AdminService);

	onAuthorChange(projectId: number, event: Event) {
		const select = event.target as HTMLSelectElement;
		const username = select.value;
		this.adminService.updateProjectAuthor(projectId, username);
	}
}
