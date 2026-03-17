import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
	label: string;
	link?: string;
}

@Component({
	selector: 'app-breadcrumb',
	imports: [RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<nav class="breadcrumb" aria-label="Навігаційний шлях">
			<ol class="breadcrumb__list">
				@for (crumb of crumbs(); track crumb.label; let last = $last) {
					<li class="breadcrumb__item">
						@if (crumb.link && !last) {
							<a [routerLink]="crumb.link" class="breadcrumb__link">{{ crumb.label }}</a>
						} @else {
							<span class="breadcrumb__current">{{ crumb.label }}</span>
						}
						@if (!last) {
							<span class="breadcrumb__sep" aria-hidden="true">›</span>
						}
					</li>
				}
			</ol>
		</nav>
	`,
	styles: `
		.breadcrumb {
			margin: 28px 0 8px;
		}

		.breadcrumb__list {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 2px 6px;
			list-style: none;
			padding: 0;
			margin: 0;
			font-size: 0.85rem;
		}

		.breadcrumb__item {
			display: flex;
			align-items: center;
			gap: 6px;
		}

		.breadcrumb__link {
			color: var(--c-primary);
			text-decoration: none;
			font-weight: 500;
			transition: color 0.2s ease;

			&:hover {
				color: var(--c-primary-hover, #1a5cff);
				text-decoration: underline;
			}
		}

		.breadcrumb__sep {
			color: var(--c-text-muted, #6b7280);
			font-size: 0.95em;
			line-height: 1;
		}

		.breadcrumb__current {
			color: var(--c-text-muted, #6b7280);
			font-weight: 500;
		}
	`,
})
export class BreadcrumbComponent {
	crumbs = input.required<Crumb[]>();
}
