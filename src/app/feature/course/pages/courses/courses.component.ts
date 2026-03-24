import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	templateUrl: './courses.component.html',
	styleUrl: './courses.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent {
	readonly _courses = [
		{
			title: 'Frontend Angular',
			level: 'Middle',
			duration: '8 тижнів',
			description:
				'Практичний курс зі створення сучасних SSR-ready інтерфейсів на Angular, Tailwind і PrimeNG.',
		},
		{
			title: 'Backend Node.js',
			level: 'Junior',
			duration: '10 тижнів',
			description:
				'Основи побудови API, роботи з базами даних, авторизацією та структурою production-ready сервісів.',
		},
		{
			title: 'QA Automation',
			level: 'Junior',
			duration: '6 тижнів',
			description:
				'Вступ до автоматизованого тестування, побудови тест-кейсів і перевірки вебзастосунків.',
		},
	];
}
