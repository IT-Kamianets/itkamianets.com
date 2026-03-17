import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BUSINESSES, Business } from '../../data/businesses.data';

@Component({
	selector: 'app-business',
	imports: [RouterLink],
	templateUrl: './business.component.html',
	styleUrl: './business.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessComponent {
	business = signal<Business | null>(null);

	constructor(private route: ActivatedRoute) {
		this.route.params.subscribe((params) => {
			const found = BUSINESSES.find((b) => b.id === params['id']) ?? null;
			this.business.set(found);
		});
	}
}
