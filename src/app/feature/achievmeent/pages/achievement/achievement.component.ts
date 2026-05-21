import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AchievementService } from '../../achievement.service';
import { Achievement } from '../../achievement.interface';

@Component({
	selector: 'app-achievement',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './achievement.component.html',
	styleUrl: './achievement.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementComponent implements OnInit {
	private readonly _route = inject(ActivatedRoute);
	private readonly _router = inject(Router);
	private readonly _achievementService = inject(AchievementService);

	protected achievement = signal<Achievement | null>(null);
	protected loading = signal(true);

	ngOnInit(): void {
		const id = this._route.snapshot.paramMap.get('id');
		if (!id) {
			this._router.navigate(['/achievements']);
			return;
		}

		this._achievementService.fetchOne(id).subscribe({
			next: (achievement) => {
				this.achievement.set(achievement);
				this.loading.set(false);
			},
			error: () => {
				this.loading.set(false);
				this._router.navigate(['/achievements']);
			},
		});
	}

	protected goBack(): void {
		this._router.navigate(['/achievements']);
	}
}
