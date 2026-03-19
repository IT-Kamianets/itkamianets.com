import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type SkillveriViewModel = {
	title: string;
	description: string;
};

@Component({
	imports: [],
	templateUrl: './skillveri.component.html',
	styleUrl: './scillveri.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillveriComponent {
	protected readonly isLoading = signal(false);
	protected readonly errorMessage = signal('');

	protected readonly model = signal<SkillveriViewModel>({
		title: 'Skill Verification',
		description: 'Заготовка сторінки для перевірки навичок.',
	});

	protected startLoading(): void {
		this.isLoading.set(true);
		this.errorMessage.set('');
	}

	protected stopLoading(message = ''): void {
		this.isLoading.set(false);
		this.errorMessage.set(message);
	}
}
