import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	QUEST_CATEGORIES,
	QUEST_DIFFICULTIES,
	Quest,
	QuestData,
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
export class ManageQuestsComponent implements OnInit {
	protected readonly questService = inject(QuestService);
	protected readonly quests = this.questService.quests;
	protected readonly categories = QUEST_CATEGORIES;
	protected readonly difficulties = QUEST_DIFFICULTIES;
	protected readonly isLoading = signal(true);
	protected readonly isSaving = signal(false);
	protected readonly error = signal('');
	protected readonly isModalOpen = signal(false);
	protected readonly editingQuest = signal<Quest | null>(null);

	protected form = this.emptyForm();

	async ngOnInit() {
		await this.load();
	}

	protected async load() {
		this.isLoading.set(true);
		this.error.set('');
		try {
			await this.questService.loadAll();
		} catch (error) {
			this.error.set(error instanceof Error ? error.message : 'Failed to load quests from API.');
		} finally {
			this.isLoading.set(false);
		}
	}

	protected openAddModal() {
		this.editingQuest.set(null);
		this.form = this.emptyForm();
		this.error.set('');
		this.isModalOpen.set(true);
	}

	protected openEditModal(quest: Quest) {
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
			active: quest.active,
			link: quest.link,
			curator: quest.curator,
			location: quest.location,
		};
		this.error.set('');
		this.isModalOpen.set(true);
	}

	protected closeModal() {
		this.isModalOpen.set(false);
		this.editingQuest.set(null);
		this.error.set('');
	}

	protected async save() {
		const data: QuestData = {
			title: this.form.title.trim(),
			category: this.form.category.trim(),
			shortDescription: this.form.shortDescription.trim(),
			description: this.form.description.trim(),
			difficulty: this.form.difficulty.trim(),
			reward: this.form.reward.trim(),
			duration: this.form.duration.trim(),
			format: this.form.format.trim(),
			active: this.form.active,
			link: this.form.link.trim() || undefined,
			curator: this.form.curator.trim() || undefined,
			location: this.form.location.trim() || undefined,
		};

		this.isSaving.set(true);
		this.error.set('');
		try {
			const editing = this.editingQuest();
			if (editing) {
				await this.questService.update(editing._id, data);
			} else {
				await this.questService.create(data);
			}

			this.closeModal();
			await this.load();
		} catch (error) {
			this.error.set(error instanceof Error ? error.message : 'Failed to save quest via API.');
		} finally {
			this.isSaving.set(false);
		}
	}

	protected async delete(id: string) {
		const confirmed =
			typeof window !== 'undefined' ? window.confirm('Видалити цей квест безповоротно?') : true;
		if (!confirmed) {
			return;
		}

		this.isSaving.set(true);
		this.error.set('');
		try {
			await this.questService.delete(id);
			await this.load();
		} catch (error) {
			this.error.set(error instanceof Error ? error.message : 'Failed to delete quest via API.');
		} finally {
			this.isSaving.set(false);
		}
	}

	private emptyForm() {
		return {
			title: '',
			category: QUEST_CATEGORIES[0] || '',
			shortDescription: '',
			description: '',
			difficulty: QUEST_DIFFICULTIES[0] || '',
			reward: '',
			duration: '',
			format: '',
			active: true,
			link: '',
			curator: '',
			location: '',
		};
	}
}
