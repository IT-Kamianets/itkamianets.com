🚀 Job Board Feature: Domain-Based Implementation

Цей документ визначає технічну логіку для модуля вакансій. Увага: Автоматичне виправлення помилок та рефакторинг дозволені виключно для компонентів Job.
🛠 Технологічний стек

    Framework: Angular + Tailwind CSS

    UI Components (Admin): PrimeNG (Table, Dialog, InputText, Button)

    API: https://api.webart.work/api/itjob (Jobs) & itjobproposal (Applications)

📂 Область відповідальності (Scope)

Працювати дозволено тільки з наступними шляхами:

    src/app/feature/job/ — всі вкладені сторінки та сервіси.

    JobService та JobProposalService.

    [!IMPORTANT]
    Інші модулі проекту не чіпати. Якщо помилка виникає в іншому домені — ігнорувати або повідомити користувача.

🤖 Правила автоматичного виправлення (Self-Fixing)

Gemini має право самостійно перевіряти та виправляти наступні аспекти в межах feature/job/:

    Типізація (TypeScript):

        Якщо API повертає дані, що не відповідають інтерфейсу Job, автоматично оновити інтерфейс або додати перевірку на null/undefined.

        Виправляти помилки імпортів після перейменування папок.

    Шаблони (Angular + PrimeNG):

        Якщо p-table не відображає дані через неправильний шлях до об'єкта data, виправити прив'язку [value].

        Додавати відсутні модулі (TableModule, DialogModule тощо) у відповідні .module.ts або standalone компоненти.

    API Integration:

        Якщо запит POST /fetch повертає помилку через невірну структуру body, змінити формат відправки на { _id: string }.

        Автоматично додавати обробку помилок (catchError) у потоках RxJS для сервісу вакансій.

📋 План реалізації з PrimeNG
1. Адмінка: Керування вакансіями (manage-jobs)

    Table: Використати p-table з сортуванням по полю data.title.

    Dialog: Форма створення/редагування вакансії відкривається у p-dialog.

    Inputs: Використати pInputText для заголовка та pInputTextarea для опису.

2. Публічна частина: Список та Подача (jobs & job)

    Замінити всі статичні змінні на виклики jobService.get().

    При відправці форми "Apply" викликати jobProposalService.create().

📡 Специфікація API (Тільки для Jobs)
Метод	URL	Тіло запиту	Опис
POST	/fetch	{ "_id": "..." }	Отримати одну вакансію
POST	/create	{ "data": { ... } }	Створити вакансію
POST	/update	{ "_id": "...", "data": { ... } }	Оновити вакансію
POST	/delete	{ "_id": "..." }	Видалити вакансію
✅ Definition of Done

    Всі компоненти в feature/job/ використовують PrimeNG для адмінки.

    Логіка виправлення помилок активована лише для Job-компонентів.

    Код відповідає структурі: feature/job/pages/[jobs|job|manage-jobs|manage-applications].

Та прочитай файли CONTRIBUTING.md та README.md