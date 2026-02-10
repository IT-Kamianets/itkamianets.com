import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-footer',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
	templateUrl: './footer.html',
	styleUrl: './footer.css',
})
export class Footer {
	protected readonly year = new Date().getFullYear();

	constructor(private router: Router) {}

	navigateFromFooter(routerLink: string, queryParams?: Record<string, string>): void {
		this.router.navigate([routerLink], { queryParams });
	}

	protected readonly navLinks = [
		{ label: 'Головна', routerLink: '/' },
		{ label: 'Пропозиції', routerLink: '/proposals' },
		{ label: 'Наша команда', routerLink: '/our-team' },
		{ label: 'Наші проєкти', routerLink: '/our-projects' },
		{ label: 'Замовити', routerLink: '/order' },
	];

	protected readonly serviceLinks = [
		{ label: 'Агроіндустрія', routerLink: '/proposals', queryParams: { category: 'Агроіндустрія' } },
		{ label: 'Медицина', routerLink: '/proposals', queryParams: { category: 'Медицина' } },
		{ label: 'Заклади', routerLink: '/proposals', queryParams: { category: 'Заклади' } },
		{ label: 'Мистецтво', routerLink: '/proposals', queryParams: { category: 'Мистецтво' } },
		{ label: 'Автомобілі', routerLink: '/proposals', queryParams: { category: 'Автомобілі' } },
		{ label: 'Мода та одяг', routerLink: '/proposals', queryParams: { category: 'Мода та одяг' } },
		{ label: 'Туризм', routerLink: '/proposals', queryParams: { category: 'Туризм' } },
		{ label: 'Спорт', routerLink: '/proposals', queryParams: { category: 'Спорт' } },
		{ label: 'Освіта', routerLink: '/proposals', queryParams: { category: 'Освіта' } },
	];

	protected readonly socialLinks = [
		{ id: 'x', label: 'X', url: 'https://x.com', color: '#000000' },
		{ id: 'facebook', label: 'Facebook', url: 'https://facebook.com', color: '#1877F2' },
		{ id: 'instagram', label: 'Instagram', url: 'https://instagram.com', color: '#E4405F' },
		{ id: 'telegram', label: 'Telegram', url: 'https://t.me', color: '#26A5E4' },
		{ id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', color: '#0A66C2' },
		{ id: 'github', label: 'GitHub', url: 'https://github.com', color: '#8B5CF6' },
	];

	protected readonly supportLinks = [
		{ label: 'Help Center' },
		{ label: 'Contact Us' },
		{ label: 'FAQ' },
		{ label: 'Status' },
	];
}
