import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AchievementService } from '../../achievement.service';
import { Achievement } from '../../achievement.interface';

interface FormData {
	name: string;
	description: string;
	data: string;
}

@Component({
	selector: 'app-manage-achievements',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './manage-achievements.component.html',
	styleUrl: './manage-achievements.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageAchievementsComponent {
	protected readonly achievementService = inject(AchievementService);
	protected readonly achievements = this.achievementService.achievements;

	protected isCreateDialogOpen = signal(false);
	protected editingId = signal<string | null>(null);
	protected apiError = signal<string>('');
	protected successMessage = signal<string>('');
	protected isSubmitting = signal(false);

	protected formName = signal('');
	protected formDescription = signal('');
	protected formData = signal('{}');

	protected isEditing = computed(() => this.editingId() !== null);

	protected openCreateDialog(): void {
		this.editingId.set(null);
		this.formName.set('');
		this.formDescription.set('');
		this.formData.set('{}');
		this.apiError.set('');
		this.successMessage.set('');
		this.isCreateDialogOpen.set(true);
	}

	protected openEditDialog(achievement: Achievement): void {
		this.editingId.set(achievement._id || null);
		this.formName.set(achievement.name || '');
		this.formDescription.set(achievement.description || '');
		this.formData.set(JSON.stringify(achievement.data || {}));
		this.apiError.set('');
		this.successMessage.set('');
		this.isCreateDialogOpen.set(true);
	}

	protected closeDialog(): void {
		this.isCreateDialogOpen.set(false);
		this.editingId.set(null);
		this.formName.set('');
		this.formDescription.set('');
		this.formData.set('{}');
		this.apiError.set('');
	}

	protected saveAchievement(): void {
		const name = this.formName().trim();
		const description = this.formDescription().trim();
		const dataStr = this.formData();

		if (!name) {
			this.apiError.set('Назва обов\'язкова');
			return;
		}

		let data: Record<string, unknown>;
		try {
			data = JSON.parse(dataStr);
		} catch {
			this.apiError.set('Невірний JSON у полі data');
			return;
		}

		this.isSubmitting.set(true);
		this.apiError.set('');
		this.successMessage.set('');

		const id = this.editingId();
		const payload: Partial<Achievement> = {
			name,
			description: description || undefined,
			data,
		};

		if (id) {
			// Update
			this.achievementService.update({ ...payload, _id: id } as Achievement).subscribe({
				next: (result) => {
					if (result) {
						this.successMessage.set('Досягнення оновлено!');
						setTimeout(() => this.closeDialog(), 1000);
					} else {
						this.apiError.set('Помилка при оновленні');
					}
					this.isSubmitting.set(false);
				},
				error: (err) => {
					this.apiError.set(err?.message || 'Помилка при оновленні');
					this.isSubmitting.set(false);
				},
			});
		} else {
			// Create
			this.achievementService.create(payload).subscribe({
				next: (result) => {
					if (result) {
						this.successMessage.set('Досягнення створено!');
						setTimeout(() => this.closeDialog(), 1000);
					} else {
						this.apiError.set('Помилка при створенні');
					}
					this.isSubmitting.set(false);
				},
				error: (err) => {
					this.apiError.set(err?.message || 'Помилка при створенні');
					this.isSubmitting.set(false);
				},
			});
		}
	}

	protected deleteAchievement(achievement: Achievement): void {
		if (!confirm(`Видалити досягнення "${achievement.name}"?`)) {
			return;
		}

		this.isSubmitting.set(true);
		this.achievementService.delete(achievement).subscribe({
			next: (success) => {
				if (success) {
					this.successMessage.set('Досягнення видалено!');
				} else {
					this.apiError.set('Помилка при видаленні');
				}
				this.isSubmitting.set(false);
			},
			error: (err) => {
				this.apiError.set(err?.message || 'Помилка при видаленні');
				this.isSubmitting.set(false);
			},
		});
	}
}
