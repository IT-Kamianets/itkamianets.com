import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	QUEST_CATEGORIES,
	QUEST_DIFFICULTIES,
	Quest,
} from '../../../feature/quest/quest.interface';
import { QuestService } from '../../../feature/quest/quest.service';

@Component({
	selector: 'app-manage-quests',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './quests.component.html',
	styleUrl: './quests.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageQuestsComponent {
	protected readonly questService = inject(QuestService);
	protected readonly quests = this.questService.quests;
	protected readonly categories = QUEST_CATEGORIES;
	protected readonly difficulties = QUEST_DIFFICULTIES;

	protected isModalOpen = signal(false);
	protected editingQuest = signal<Quest | null>(null);

	protected form = this.emptyForm();

	private emptyForm() {
		return {
			title: '',
			category: QUEST_CATEGORIES[0],
			shortDescription: '',
			description: '',
			difficulty: QUEST_DIFFICULTIES[0],
			reward: '',
			duration: '',
			format: '',
			active: true,
			link: '',
			curator: '',
			location: '',
		};
	}

	openAddModal() {
		this.editingQuest.set(null);
		this.form = this.emptyForm();
		this.isModalOpen.set(true);
	}

	openEditModal(quest: Quest) {
		this.editingQuest.set(quest);
		this.form = {
			title: quest.title,
			category: quest.category,
			shortDescription: quest.shortDescription,
			description: quest.description,
			difficulty: quest.difficulty,
			reward: quest.reward,
			duration: quest.duration,
			format: quest.format,
			active: quest.active ?? false,
			link: quest.link ?? '',
			curator: quest.curator ?? '',
			location: quest.location ?? '',
		};
		this.isModalOpen.set(true);
	}

	closeModal() {
		this.isModalOpen.set(false);
		this.editingQuest.set(null);
	}

	save() {
		const data: Omit<Quest, 'id'> = {
			title: this.form.title,
			category: this.form.category,
			shortDescription: this.form.shortDescription,
			description: this.form.description,
			difficulty: this.form.difficulty,
			reward: this.form.reward,
			duration: this.form.duration,
			format: this.form.format,
			active: this.form.active || undefined,
			link: this.form.link || undefined,
			curator: this.form.curator || undefined,
			location: this.form.location || undefined,
		};

		const editing = this.editingQuest();
		if (editing) {
			this.questService.update({ ...data, id: editing.id });
		} else {
			this.questService.add(data);
		}

		this.closeModal();
	}

	delete(id: string) {
		if (confirm('Ви впевнені, що хочете видалити цей квест?')) {
			this.questService.delete(id);
		}
	}
}
