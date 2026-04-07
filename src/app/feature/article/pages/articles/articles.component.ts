import { ChangeDetectionStrategy, Component, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common'; // Підключення DatePipe

interface NewsItem {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt?: number; // Додано поле дати
}

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [FormsModule, DatePipe], // Додано DatePipe сюди
    templateUrl: './articles.component.html',
    styleUrl: './articles.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent {
    protected readonly newsList = signal<NewsItem[]>(this.loadFromStorage());
    
    protected readonly isModalOpen = signal<boolean>(false);
    protected readonly formTitle = signal<string>('');
    protected readonly formContent = signal<string>('');
    protected readonly formImageUrl = signal<string>('');
    protected readonly editingId = signal<string | null>(null);

    protected readonly itemToDelete = signal<NewsItem | null>(null);
    protected readonly undoState = signal<{ item: NewsItem; index: number } | null>(null);
    protected readonly isUndoVisible = signal<boolean>(false);
    private undoTimeoutId: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
        effect(() => {
            localStorage.setItem('my_articles_db', JSON.stringify(this.newsList()));
        });
    }

    private loadFromStorage(): NewsItem[] {
        const saved = localStorage.getItem('my_articles_db');
        if (saved) {
            try {
                const parsed: NewsItem[] = JSON.parse(saved);
                // Відновлюємо дати для старих новин, якщо їх не було
                return parsed.map(item => ({
                    ...item,
                    createdAt: item.createdAt || parseInt(item.id, 10)
                }));
            } catch (e) {
                return [];
            }
        }
        return [];
    }
    
    protected openModal(): void {
        this.resetForm();
        this.isModalOpen.set(true);
    }

    protected closeModal(): void {
        this.isModalOpen.set(false);
        this.resetForm();
    }

    protected handleFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target?.result as string;
                this.formImageUrl.set(base64String);
            };
            reader.readAsDataURL(file);
        }
    }

    protected handleSave(): void {
        const title = this.formTitle().trim();
        const content = this.formContent().trim();
        const imageUrl = this.formImageUrl().trim();

        if (!title || !content) return;

        const currentEditingId = this.editingId();

        if (currentEditingId) {
            this.newsList.update(list => list.map(item => 
                item.id === currentEditingId ? { ...item, title, content, imageUrl } : item
            ));
        } else {
            const newItem: NewsItem = {
                id: Date.now().toString(),
                title,
                content,
                imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Немає+фото',
                createdAt: Date.now() // Записуємо поточний час при створенні
            };
            this.newsList.update(list => [newItem, ...list]);
        }
        this.closeModal();
    }

    protected handleEdit(event: Event, item: NewsItem): void {
        event.stopPropagation();
        this.formTitle.set(item.title);
        this.formContent.set(item.content);
        this.formImageUrl.set(item.imageUrl);
        this.editingId.set(item.id);
        this.isModalOpen.set(true);
    }

    private resetForm(): void {
        this.formTitle.set('');
        this.formContent.set('');
        this.formImageUrl.set('');
        this.editingId.set(null);
    }

    protected handleDeleteClick(event: Event, item: NewsItem): void {
        event.stopPropagation();
        this.itemToDelete.set(item);
    }

    protected cancelDelete(): void {
        this.itemToDelete.set(null);
    }

    protected confirmDelete(): void {
        const item = this.itemToDelete();
        if (!item) return;

        const currentList = this.newsList();
        const index = currentList.findIndex(x => x.id === item.id);
        
        if (index > -1) {
            this.undoState.set({ item, index });
            this.newsList.update(list => list.filter(x => x.id !== item.id));
            this.isUndoVisible.set(true);
            if (this.undoTimeoutId) {
                clearTimeout(this.undoTimeoutId);
            }
            this.undoTimeoutId = setTimeout(() => {
                this.isUndoVisible.set(false);
                this.undoState.set(null);
            }, 3000);
        }
        this.itemToDelete.set(null);
    }

    protected undoDelete(): void {
        const state = this.undoState();
        if (state) {
            this.newsList.update(list => {
                const newList = [...list];
                newList.splice(state.index, 0, state.item);
                return newList;
            });
            this.isUndoVisible.set(false);
            this.undoState.set(null);
            if (this.undoTimeoutId) {
                clearTimeout(this.undoTimeoutId);
            }
        }
    }
    
    protected goToArticle(id: string): void {
        this.router.navigate(['../article', id], { relativeTo: this.route });
    }
}