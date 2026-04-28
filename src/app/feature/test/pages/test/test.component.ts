import { isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Injector,
	PLATFORM_ID,
	computed,
	inject,
	signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Test, Question } from '../../test.interface';
import { TestService } from '../../test.service';
import { TestResultService } from '../../test-result.service';
import { UserService } from '../../../user/user.service';

@Component({
	selector: 'app-test',
	imports: [RouterLink],
	templateUrl: './test.component.html',
	styleUrl: './test.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {
	private readonly _injector = inject(Injector);
	private readonly _route = inject(ActivatedRoute);
	private readonly _router = inject(Router);
	private readonly _platformId = inject(PLATFORM_ID);

	readonly test = signal<Test | null>(null);
	readonly currentQuestionIndex = signal(0);
	readonly answers = signal<number[]>([]);
	readonly isCompleted = signal(false);
	readonly score = signal(0);
	readonly isSavingResult = signal(false);
	readonly apiError = signal('');

	readonly currentQuestion = computed<Question | null>(() => {
		const test = this.test();
		if (!test) {
			return null;
		}

		return test.data.questions[this.currentQuestionIndex()] || null;
	});

	constructor(title: Title, meta: Meta) {
		title.setTitle('Тест | IT-Kamianets');
		meta.updateTag({
			name: 'description',
			content: 'Перевірка навичок IT-Kamianets.',
		});

		if (!isPlatformBrowser(this._platformId)) {
			return;
		}

		const id = this._route.snapshot.paramMap.get('id');
		if (id) {
			this._injector
				.get(TestService)
				.fetchOne(id)
				.subscribe((test) => {
					if (test) {
						this.test.set(test);
						this.answers.set(new Array(test.data.questions.length).fill(-1));
						title.setTitle(`${test.data.title} | IT-Kamianets`);
						meta.updateTag({
							name: 'description',
							content: test.data.description,
						});
					} else {
						this._router.navigate(['/tests']);
					}
				});
		} else {
			this._router.navigate(['/tests']);
		}
	}

	selectAnswer(answerIndex: number): void {
		const answers = [...this.answers()];
		answers[this.currentQuestionIndex()] = answerIndex;
		this.answers.set(answers);
	}

	nextQuestion(): void {
		if (this.currentQuestionIndex() < (this.test()?.data.questions.length || 0) - 1) {
			this.currentQuestionIndex.update((i) => i + 1);
		}
	}

	previousQuestion(): void {
		if (this.currentQuestionIndex() > 0) {
			this.currentQuestionIndex.update((i) => i - 1);
		}
	}

	submitTest(): void {
		const test = this.test();
		if (!test || !test.data.questions.length) return;

		const answers = this.answers();
		let correct = 0;
		test.data.questions.forEach((q, i) => {
			if (answers[i] === q.correct) correct++;
		});
		const score = Math.round((correct / test.data.questions.length) * 100);
		this.score.set(score);
		this.isCompleted.set(true);
		this.isSavingResult.set(true);
		this.apiError.set('');

		const user = this._injector.get(UserService).user();

		this._injector
			.get(TestResultService)
			.create({
				testId: test._id || '',
				userId: user._id || '',
				data: {
					answers,
					score,
					correct,
					total: test.data.questions.length,
					completedAt: new Date().toISOString(),
					testTitle: test.data.title,
				},
			})
			.subscribe({
				next: (saved) => {
					this.isSavingResult.set(false);
					if (!saved) {
						this.apiError.set('Результат показано, але не вдалося зберегти спробу.');
					}
				},
				error: () => {
					this.isSavingResult.set(false);
					this.apiError.set('Результат показано, але не вдалося зберегти спробу.');
				},
			});
	}

	restartTest(): void {
		this.currentQuestionIndex.set(0);
		this.answers.set(new Array(this.test()?.data.questions.length || 0).fill(-1));
		this.isCompleted.set(false);
		this.score.set(0);
	}
}
