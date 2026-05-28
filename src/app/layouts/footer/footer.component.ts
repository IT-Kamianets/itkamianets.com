import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-footer',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss',
})
export class FooterComponent {
	protected readonly year = new Date().getFullYear();

	constructor(private router: Router) {}

	navigateFromFooter(routerLink: string, queryParams?: Record<string, string>): void {
		if (queryParams) {
			this.router.navigate([routerLink], { queryParams });
			return;
		}

		this.router.navigateByUrl(routerLink);
	}

	protected readonly navLinks = [
		{ label: 'Головна', routerLink: '/' },
		{ label: 'Послуги', routerLink: '/services' },
		{ label: 'Проєкти', routerLink: '/projects' },
		{ label: 'Хакатони', routerLink: '/hackathons' },
		{ label: 'Компанії', routerLink: '/companies' },
		{ label: 'Команда', routerLink: '/team' },
		{ label: 'CV Generation', routerLink: '/cv-generation' },
	];

	protected readonly serviceLinks: { label: string; routerLink: string; queryParams?: Record<string, string> }[] = [
		{ label: 'IT Kamianets', routerLink: '/services', queryParams: { category: 'it-kamianets' } },
		{ label: 'Web Art Work', routerLink: '/services', queryParams: { category: 'web-art-work' } },
		{ label: 'Всі послуги', routerLink: '/services' },
	];

	protected readonly socialLinks = [
		// { id: 'x', label: 'X', url: 'https://x.com', color: '#000000' },
		// { id: 'facebook', label: 'Facebook', url: 'https://facebook.com', color: '#1877F2' },
		// { id: 'instagram', label: 'Instagram', url: 'https://instagram.com', color: '#E4405F' },
		// { id: 'telegram', label: 'Telegram', url: 'https://t.me', color: '#26A5E4' },
		// { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', color: '#0A66C2' },
		{ id: 'github', label: 'GitHub', url: 'https://github.com/IT-Kamianets', color: '#8B5CF6' },
	];

	protected readonly supportLinks = [
		{ label: 'Контакти', routerLink: '/contacts' },
	];
}
