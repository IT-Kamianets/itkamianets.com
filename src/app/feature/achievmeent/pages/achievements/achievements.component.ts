import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AchievementService } from '../../achievement.service';
import { Achievement } from '../../achievement.interface';

@Component({
	selector: 'app-achievements',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './achievements.component.html',
	styleUrl: './achievements.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementsComponent {
	private readonly _router = inject(Router);
	protected readonly achievementService = inject(AchievementService);
	protected readonly achievements = this.achievementService.achievements;

	protected goToDetail(achievement: Achievement): void {
		this._router.navigate(['/achievement', achievement._id]);
	}
}
