import { Injectable, signal } from '@angular/core';
import { Service, ServiceProvider } from './service.interface';

@Injectable({
	providedIn: 'root',
})
export class ServiceService {
	private readonly _services = signal<Service[]>([
		{
			id: 's1',
			title: 'Лендінг сторінка',
			shortDescription: 'Професійна односторінкова візитка для вашого бізнесу.',
			fullDescription: 'Створення високоефективної посадкової сторінки, орієнтованої на конверсію. Ми розробляємо унікальний дизайн, який підкреслює переваги вашого продукту або послуги.',
			category: 'Лендінг',
			image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
			features: [
				'Унікальний дизайн',
				'Адаптивність під мобільні пристрої',
				'Оптимізація швидкості завантаження',
				'Базова SEO-підготовка',
				'Форми зворотного зв’язку',
			],
			provider: {
				id: 'p1',
				name: 'Гончар Денис',
				avatar: 'Honchar_Denys',
				role: 'Full-stack Developer',
				rating: 4.9,
				completedProjects: 15
			},
			priceFrom: 5000,
			currency: 'UAH',
			timeFrom: 1,
			timeTo: 2,
			timeUnit: 'weeks'
		},
		{
			id: 's2',
			title: 'Динамічна зміна лендінгу',
			shortDescription: 'Лендінг з можливістю самостійного керування контентом.',
			fullDescription: 'Розширене рішення, яке включає інтегровану систему керування вмістом (CMS). Ви отримуєте можливість самостійно змінювати тексти, зображення, ціни та акційні пропозиції.',
			category: 'Динамічний лендінг',
			image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=500&fit=crop',
			features: [
				'Зручна панель адміністратора',
				'Редагування контенту в один клік',
				'Керування медіа-бібліотекою',
				'Можливість додавання нових блоків',
				'Аналітика відвідуваності',
			],
			provider: {
				id: 'p2',
				name: 'Вальцер Вадим',
				avatar: 'Vadim_Valtser',
				role: 'Frontend Developer',
				rating: 4.8,
				completedProjects: 8
			},
			priceFrom: 12000,
			currency: 'UAH',
			timeFrom: 2,
			timeTo: 4,
			timeUnit: 'weeks'
		},
		{
			id: 's3',
			title: 'UI/UX Дизайн та Прототипування',
			shortDescription: 'Створення сучасних та зручних інтерфейсів для ваших продуктів.',
			fullDescription: 'Ми розробляємо інтерфейси, які закохують користувачів з першого погляду. Від аналізу цільової аудиторії до високоточних інтерактивних прототипів.',
			category: 'Дизайн',
			image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&h=500&fit=crop',
			features: [
				'Аналіз конкурентів',
				'Wireframes',
				'Інтерактивні прототипи',
				'Дизайн-системи',
				'Адаптивний дизайн',
			],
			provider: {
				id: 'p3',
				name: 'Макуш Валерія',
				avatar: 'Valery_Makush',
				role: 'UI/UX Designer',
				rating: 5.0,
				completedProjects: 12
			},
			priceFrom: 8000,
			currency: 'UAH',
			timeFrom: 1,
			timeTo: 3,
			timeUnit: 'weeks'
		}
	]);

	services = this._services.asReadonly();
}
