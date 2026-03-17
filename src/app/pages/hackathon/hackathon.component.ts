import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HACKATHON_PAGE } from '../../data/hackathons.data';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb.component';

@Component({
	selector: 'app-hackathon',
	imports: [BreadcrumbComponent],
	templateUrl: './hackathon.component.html',
	styleUrl: './hackathon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonComponent {
	protected readonly page = HACKATHON_PAGE;
	protected readonly breadcrumbs = [
		{ label: 'Хакатони', link: '/hackathons' },
		{ label: HACKATHON_PAGE.title },
	];
}
