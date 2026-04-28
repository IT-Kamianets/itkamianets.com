import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ArticleService } from '../../article.service';
import { Article } from '../../article.interface'; // Імпортуємо правильний інтерфейс

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './articles.component.html',
    styleUrl: './articles.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private articleService = inject(ArticleService);

    protected readonly newsList = signal<Article[]>([]);
    protected readonly itemToDelete = signal<Article | null>(null);

    ngOnInit(): void {
        this.fetchArticles();
    }

    private fetchArticles(): void {
        this.articleService.getAllArticles().subscribe({
            next: (response: any) => {
                console.log('Дані з сервера:', response); // Дивимось в консоль (F12)
                this.newsList.set(response);
                
                // Розумна перевірка формату даних
                if (Array.isArray(response)) {
    this.newsList.set(response);

} else if (response?.data && Array.isArray(response.data)) {
    this.newsList.set(response.data);

} else if (response?.articles && Array.isArray(response.articles)) {
    this.newsList.set(response.articles);

} else if (response?.result && Array.isArray(response.result)) { // ✅ ДОДАНО
    this.newsList.set(response.result);

} else {
    console.warn('Невідомий формат даних', response);
    this.newsList.set([]);
}
            },
            error: (err) => console.error('Помилка завантаження новин', err)
        });
    }

    protected goToCreate(): void {
        this.router.navigate(['../manage-articles'], { relativeTo: this.route });
    }

    protected handleEdit(event: Event, item: Article): void {
        event.stopPropagation();
        const targetId = item._id || item.id;
        if (targetId) {
            this.router.navigate(['../manage-articles', targetId], { relativeTo: this.route });
        }
    }

    protected handleDeleteClick(event: Event, item: Article): void {
        event.stopPropagation();
        this.itemToDelete.set(item);
    }

    protected cancelDelete(): void {
        this.itemToDelete.set(null);
    }

    protected confirmDelete(): void {
        const item = this.itemToDelete();
        if (!item) return;

        const targetId = item._id || item.id;
        if (targetId) {
            this.articleService.deleteArticle(targetId).subscribe({
                next: () => {
                    this.fetchArticles(); // Оновлюємо список після видалення
                    this.itemToDelete.set(null);
                },
                error: (err) => console.error('Помилка видалення', err)
            });
        }
    }
    
    protected goToArticle(item: Article): void {
        const targetId = item._id || item.id;
        if (targetId) {
            this.router.navigate(['../article', targetId], { relativeTo: this.route });
        }
    }
}