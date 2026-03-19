import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProjectService } from '../../feature/project/project.service';
import { ManagedProject } from '../../feature/project/project.interface';

@Component({
	selector: 'app-quests',
	imports: [NgClass],
	templateUrl: './quests.component.html',
	styleUrl: './quests.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestsComponent {
	private readonly _projectService = inject(ProjectService);

	readonly quests = computed(() => this._projectService.projects());

	getImageSrc(quest: ManagedProject): string {
		return quest.imageKind === 'upload' ? quest.image : `project/${quest.image}.png`;
	}

	getBadgeLabel(quest: ManagedProject): string {
		switch (quest.category) {
			case 'theme-tailwind':
				return 'Tailwind';
			case 'theme-bulma':
				return 'Bulma';
			case 'theme-bootstrap':
				return 'Bootstrap';
			default:
				return 'Quest';
		}
	}

	getBadgeClass(quest: ManagedProject): string {
		switch (quest.category) {
			case 'theme-tailwind':
				return 'project-card__badge--tailwind';
			case 'theme-bulma':
				return 'project-card__badge--bulma';
			case 'theme-bootstrap':
				return 'project-card__badge--bootstrap';
			default:
				return 'project-card__badge--custom';
		}
	}
}
