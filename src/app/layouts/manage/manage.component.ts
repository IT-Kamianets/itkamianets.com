import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ScrollToTopComponent } from '../../shared/scroll-to-top.component';
import { ManageHeaderComponent } from '../manage-header/manage-header.component';

@Component({
	selector: 'app-manage',
	imports: [
		ManageHeaderComponent,
		RouterLink,
		RouterLinkActive,
		RouterOutlet,
		ScrollToTopComponent,
	],
	templateUrl: './manage.component.html',
	styleUrl: './manage.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageComponent {
	protected readonly navItems = [
		{ label: 'Profiles', path: '/manage/profile', icon: 'account_circle' },
		{ label: 'Merch', path: '/manage/merch', icon: 'shopping_bag' },
		{ label: 'Orders', path: '/manage/orders', icon: 'receipt_long' },
		{ label: 'Companies', path: '/manage/companies', icon: 'apartment' },
		{ label: 'Projects', path: '/manage/projects', icon: 'deployed_code' },
		{ label: 'Articles', path: '/manage/articles', icon: 'article' },
		{ label: 'Schools', path: '/manage/schools', icon: 'school' },
		{ label: 'Jobs', path: '/manage/jobs', icon: 'work' },
		{ label: 'Events', path: '/manage/events', icon: 'event' },
		{ label: 'Competitions', path: '/manage/competitions', icon: 'emoji_events' },
		{ label: 'People', path: '/manage/people', icon: 'group' },
		{ label: 'Options', path: '/manage/manage-options', icon: 'settings' },
		{ label: 'Certificates', path: '/manage/manage-certificates', icon: 'workspace_premium' },
		{ label: 'CV Generation', path: '/manage/cv-generation', icon: 'description' },
	];
}
