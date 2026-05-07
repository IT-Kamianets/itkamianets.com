import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Quest } from '../../feature/quest/quest.interface';
import { QuestService } from '../../feature/quest/quest.service';

@Component({
	selector: 'app-quests',
	imports: [NgClass],
	templateUrl: './quests.component.html',
	styleUrl: './quests.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestsComponent implements OnInit {
	private readonly _questService = inject(QuestService);

	readonly quests = this._questService.quests;
	readonly isLoading = signal(true);

	async ngOnInit() {
		await this._questService.loadAll();
		this.isLoading.set(false);
	}

	trackByQuestId(index: number, quest: Quest): string {
		return quest._id || String(index);
	}

	getBadgeLabel(quest: Quest): string {
		switch (quest.category) {
			case 'Освітній':
				return 'Навчання';
			case 'Технічний':
				return 'Tech';
			case 'Командний':
				return 'Команда';
			case 'Кар’єрний':
				return 'Карʼєра';
			case 'Творчий':
				return 'Ідея';
			default:
				return quest.category;
		}
	}

	getBadgeClass(quest: Quest): string {
		switch (quest.category) {
			case 'Освітній':
				return 'project-card__badge--tailwind';
			case 'Командний':
				return 'project-card__badge--bulma';
			case 'Технічний':
				return 'project-card__badge--bootstrap';
			default:
				return 'project-card__badge--custom';
		}
	}
}
