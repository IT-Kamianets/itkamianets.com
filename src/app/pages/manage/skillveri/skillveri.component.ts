import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type SkillveriViewModel = {
	title: string;
	description: string;
	status: string;
};

type SkillveriStat = {
	label: string;
	value: string;
	hint: string;
};

type SkillveriStep = {
	icon: string;
	title: string;
	description: string;
};

type SkillveriTemplate = {
	title: string;
	level: string;
	duration: string;
	roles: string;
	tags: string[];
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
		title: 'SkillVeri',
		description:
			'Панель керування для швидкої реєстрації перевірок навичок, формування шаблонів і відстеження результатів.',
		status: 'Активний',
	});

	protected readonly stats: SkillveriStat[] = [
		{ label: 'Запусків', value: '128', hint: 'за останні 30 днів' },
		{ label: 'Середній час', value: '42 хв', hint: 'від старту до звіту' },
		{ label: 'Успішність', value: '86%', hint: 'кандидатів пройшли' },
	];

	protected readonly steps: SkillveriStep[] = [
		{
			icon: 'assignment_turned_in',
			title: 'Сформуйте чекліст',
			description: 'Оберіть навички, завдання і рівень складності під вакансію.',
		},
		{
			icon: 'tune',
			title: 'Налаштуйте правила',
			description: 'Встановіть час, поріг успіху та правила прозорості перевірки.',
		},
		{
			icon: 'rocket_launch',
			title: 'Запросіть кандидатів',
			description: 'Відправте посилання або інтегруйте з ATS та CRM.',
		},
		{
			icon: 'insights',
			title: 'Отримайте аналітику',
			description: 'Переглядайте звіти, ранжування і динаміку прогресу.',
		},
	];

	protected readonly templates: SkillveriTemplate[] = [
		{
			title: 'Frontend React/Angular',
			level: 'Middle',
			duration: '60 хв',
			roles: '2 ролі',
			tags: ['TypeScript', 'UI', 'API'],
		},
		{
			title: 'Backend Node.js',
			level: 'Senior',
			duration: '75 хв',
			roles: '1 роль',
			tags: ['API', 'Security', 'Performance'],
		},
		{
			title: 'QA Automation',
			level: 'Junior',
			duration: '45 хв',
			roles: '3 ролі',
			tags: ['Testing', 'CI', 'Reports'],
		},
	];

	protected readonly requirements = [
		'Підтвердження особи кандидата',
		'Захист від підміни вкладок',
		'Відеозапис і скриншоти',
		'Експорт результатів у PDF',
	];

	protected startLoading(): void {
		this.isLoading.set(true);
		this.errorMessage.set('');
	}

	protected stopLoading(message = ''): void {
		this.isLoading.set(false);
		this.errorMessage.set(message);
	}
}
