import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HackathonCard {
	id: number;
	title: string;
	format: string;
	season: string;
	focus: string;
	description: string;
	stack: string[];
	cta: string;
}

@Component({
	selector: 'app-hackathons',
	imports: [RouterLink],
	templateUrl: './hackathons.component.html',
	styleUrl: './hackathons.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonsComponent {
	protected readonly hackathons: HackathonCard[] = [
		{
			id: 1,
			title: 'Міський цифровий спринт',
			format: '48-годинний командний хакатон',
			season: 'Весна 2026',
			focus: 'GovTech та цифрові сервіси для громади',
			description:
				'Команди розробників створюють прототипи для запитів міста, кабінетів мешканців та автоматизації публічних сервісів.',
			stack: ['Angular', 'SSR', 'Мапи', 'Доступність'],
			cta: '/hackathon',
		},
		{
			id: 2,
			title: 'Commerce Build Jam',
			format: 'Вікенд-челендж із розробки',
			season: 'Літо 2026',
			focus: 'E-commerce та бізнес-лендінги',
			description:
				'Кросфункціональні команди збирають вітрини, промосторінки та конверсійні фронтенд-сценарії для локальних брендів.',
			stack: ['Angular', 'Tailwind', 'Оплати', 'Аналітика'],
			cta: '/hackathon',
		},
		{
			id: 3,
			title: 'AI Product Forge',
			format: '72-годинний продуктовий спринт',
			season: 'Осінь 2026',
			focus: 'AI-інструменти для операційних команд',
			description:
				'Невеликі інженерні команди перевіряють AI-гіпотези, демонструють робочі прототипи та презентують план запуску журі.',
			stack: ['Angular', 'LLM API', 'Дашборди', 'Візуалізація даних'],
			cta: '/hackathon',
		},
	];
}
