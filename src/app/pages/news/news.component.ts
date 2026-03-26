import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NewsItem } from '../../feature/item/item.interface';

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrl: './news.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
	readonly categories = ['All', 'Events', 'Updates', 'Articles'] as const;
	activeFilter = signal<string>('All');

	readonly newsItems: NewsItem[] = [
		{
			_id: 'news-1',
			type: 'news',
			title: 'IT-Kamianets запускає програму стажування 2026',
			excerpt:
				'Ми відкриваємо нову хвилю набору для студентів та початківців у сфері веб-розробки. Долучайтесь до нашої команди та здобувайте реальний досвід роботи з комерційними проєктами.',
			image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop', // повертаю попереднє фото
			date: '10 лютого 2026',
			category: 'events',
		},
		{
			_id: 'news-2',
			type: 'news',
			title: 'Оновлення портфоліо: 3 нові проєкти на Tailwind CSS',
			excerpt:
				'Наша команда завершила роботу над трьома новими веб-сайтами, створеними з використанням Tailwind CSS. Кожен проєкт демонструє сучасний підхід до дизайну та розробки.',
			image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '5 лютого 2026',
			category: 'updates',
		},
		{
			_id: 'news-3',
			type: 'news',
			title: 'Як ми будуємо веб-сайти: наш процес від А до Я',
			excerpt:
				'Від першої консультації до фінального запуску — дізнайтесь, як працює наша команда і чому клієнти обирають IT-Kamianets для реалізації своїх ідей.',
			image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '1 лютого 2026',
			category: 'articles',
		},
		{
			_id: 'news-4',
			type: 'news',
			title: 'Зустріч команди: підсумки січня 2026',
			excerpt:
				'Зібрались разом, обговорили досягнення минулого місяця, нові цілі та плани щодо розширення нашого впливу в регіоні.',
			image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '28 січня 2026',
			category: 'events',
		},
		{
			_id: 'news-5',
			type: 'news',
			title: 'Новий мерч IT-Kamianets вже доступний!',
			excerpt:
				'Чашки, футболки та стікери з логотипом IT-Kamianets — тепер ви можете підтримати нашу спільноту та виглядати стильно.',
			image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '20 січня 2026',
			category: 'updates',
		},
		{
			_id: 'news-6',
			type: 'news',
			title: '5 трендів веб-розробки у 2026 році',
			excerpt:
				'Angular, Tailwind, SSR, AI-інтеграції та доступність — розглядаємо ключові тренди, які визначатимуть веб у цьому році.',
			image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '15 січня 2026',
			category: 'articles',
		},
		{
			_id: 'news-7',
			type: 'news',
			title: 'Хакатон IT-Kamianets: 24 години коду',
			excerpt:
				'Ми провели перший внутрішній хакатон, де розробники змагались у створенні MVP за 24 години. Результати вразили всіх — три проєкти вже готуються до запуску.',
			image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '12 січня 2026',
			category: 'events',
		},
		{
			_id: 'news-8',
			type: 'news',
			title: 'Перехід на Angular 21: що змінилось',
			excerpt:
				'Ми мігрували всі наші проєкти на Angular 21. Сигнали, нові контрольні потоки та покращений SSR — ділимось досвідом та результатами.',
			image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '8 січня 2026',
			category: 'updates',
		},
		{
			_id: 'news-9',
			type: 'news',
			title: 'Чому Tailwind CSS — це майбутнє стилізації',
			excerpt:
				'Порівнюємо utility-first підхід з класичними CSS-методологіями. Результати продуктивності та швидкості розробки вас здивують.',
			image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '3 січня 2026',
			category: 'articles',
		},
		{
			_id: 'news-10',
			type: 'news',
			title: 'IT-Kamianets на конференції WebDev Summit 2025',
			excerpt:
				'Наша команда взяла участь у найбільшій веб-конференції України. Доповіді, нетворкінг та нові партнерства — розповідаємо подробиці.',
			image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '20 грудня 2025',
			category: 'events',
		},
		{
			_id: 'news-11',
			type: 'news',
			title: 'Запуск системи моніторингу для агрохолдингу',
			excerpt:
				'Успішно завершили та впровадили GPS-систему моніторингу полів для одного з найбільших агропідприємств Хмельницької області.',
			image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '15 грудня 2025',
			category: 'updates',
		},
		{
			_id: 'news-12',
			type: 'news',
			title: 'Як обрати правильний CSS-фреймворк для свого проєкту',
			excerpt:
				'Tailwind vs Bootstrap vs Bulma — детальний аналіз переваг, недоліків та найкращих сценаріїв використання кожного фреймворку.',
			image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop', // назва файлу з папки public/images/news/
			date: '10 грудня 2025',
			category: 'articles',
		},
	];

	setFilter(filter: string): void {
		this.activeFilter.set(filter);
	}

	get filteredNews(): NewsItem[] {
		const f = this.activeFilter();
		if (f === 'All') return this.newsItems;
		return this.newsItems.filter((n) => n.category === f.toLowerCase());
	}

	getCategoryLabel(cat: string): string {
		switch (cat) {
			case 'events':
				return 'Подія';
			case 'updates':
				return 'Оновлення';
			case 'articles':
				return 'Стаття';
			default:
				return cat;
		}
	}
}
