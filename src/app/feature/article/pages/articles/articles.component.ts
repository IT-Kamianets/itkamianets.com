import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface NewsItem {
    id: string;
    title: string;
    content: string;
}

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './articles.component.html',
    styleUrl: './articles.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent {
    // Реактивний стан компонента
    protected readonly newsList = signal<NewsItem[]>([]);
    protected readonly formTitle = signal<string>('');
    protected readonly formContent = signal<string>('');
    protected readonly editingId = signal<string | null>(null);

    // Додавання або збереження після редагування
    protected handleSave(): void {
        const title = this.formTitle().trim();
        const content = this.formContent().trim();

        if (!title || !content) return;

        const currentEditingId = this.editingId();

        if (currentEditingId) {
            // Оновлюємо існуючу новину
            this.newsList.update(list => list.map(item => 
                item.id === currentEditingId ? { ...item, title, content } : item
            ));
            this.editingId.set(null);
        } else {
            // Створюємо нову
            const newItem: NewsItem = {
                id: Date.now().toString(),
                title,
                content
            };
            this.newsList.update(list => [newItem, ...list]);
        }

        // Очищаємо форму
        this.formTitle.set('');
        this.formContent.set('');
    }

    // Перенесення даних у форму для редагування
    protected handleEdit(item: NewsItem): void {
        this.formTitle.set(item.title);
        this.formContent.set(item.content);
        this.editingId.set(item.id);
    }

    // Видалення
    protected handleDelete(id: string): void {
        this.newsList.update(list => list.filter(item => item.id !== id));
    }
}