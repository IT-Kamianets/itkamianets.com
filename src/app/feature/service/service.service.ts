import { Injectable, signal } from '@angular/core';
import { Service } from './service.interface';

export const SERVICE_IDS = ['it-kamianets', 'web-art-work'] as const;

@Injectable({
	providedIn: 'root',
})
export class ServiceService {
	private readonly _services = signal<Service[]>([
		{
			id: 'it-kamianets',
			title: 'IT Kamianets — базовий сайт',
			shortDescription: 'Розробники IT Kamianets безкоштовно створюють простий сайт для місцевого бізнесу.',
			fullDescription:
				'IT Kamianets — громадська ініціатива, яка об\'єднує місцевих розробників для підтримки малого бізнесу Кам\'янця-Подільського. У рамках цієї послуги команда безкоштовно розробляє односторінковий сайт-візитку для локального підприємця: з описом бізнесу, контактами, галереєю та формою зворотного зв\'язку. Сайт оптимізований для пошукових систем і адаптований під мобільні пристрої.',
			category: 'Безкоштовно',
			image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
			features: [
				'Одна сторінка-візитка',
				'Адаптивний дизайн (mobile-first)',
				'Базова SEO-оптимізація',
				'Форма зворотного зв\'язку',
				'Інтеграція з Google Maps',
				'Хостинг на перший рік включено',
			],
			provider: {
				id: 'it-kamianets-team',
				name: 'IT Kamianets',
				avatar: 'it_kamianets_logo',
				role: 'Команда розробників',
				description: 'Громадська організація місцевих ІТ-спеціалістів Кам\'янця-Подільського',
				completedProjects: 12,
			},
			priceFrom: 0,
			currency: 'UAH',
			timeFrom: 1,
			timeTo: 3,
			timeUnit: 'weeks',
		},
		{
			id: 'web-art-work',
			title: 'Web Art Work — розвиток сайту',
			shortDescription: 'Компанія Web Art Work бере сайт IT Kamianets, вдосконалює його та передає бізнесу з повноцінною адмін-панеллю.',
			fullDescription:
				'Web Art Work — партнерська компанія, яка спеціалізується на розвитку та комерціалізації сайтів, створених IT Kamianets. Вони отримують право власності на проект, проводять спільні доопрацювання з розробником, який будував сайт, і додають зручну адмін-панель для самостійного керування контентом. Після завершення робіт бізнес отримує повністю готовий сайт із можливістю самостійно редагувати тексти, зображення та акційні пропозиції. Далі підтримується щомісячна підписка.',
			category: 'Партнерська послуга',
			image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=500&fit=crop',
			features: [
				'Доопрацювання сайту IT Kamianets',
				'Зручна адмін-панель для керування контентом',
				'Редагування текстів, зображень, цін',
				'Технічна підтримка та хостинг',
				'Щомісячне резервне копіювання',
				'Консультації з розробником (1 год/міс)',
			],
			provider: {
				id: 'web-art-work',
				name: 'Web Art Work',
				avatar: 'web_art_work_logo',
				role: 'Веб-агенція',
				description: 'Партнерська компанія з розвитку та підтримки локальних бізнес-сайтів',
				completedProjects: 8,
			},
			priceFrom: 5000,
			currency: 'UAH',
			subscriptionFee: 500,
			timeFrom: 2,
			timeTo: 4,
			timeUnit: 'weeks',
		},
	]);

	services = this._services.asReadonly();
}
