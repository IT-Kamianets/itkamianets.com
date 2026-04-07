import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ArticleService, NewsItem } from '../../article.service';

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

    protected readonly newsList = signal<NewsItem[]>([]);
    protected readonly itemToDelete = signal<NewsItem | null>(null);

    ngOnInit(): void {
        this.fetchArticles();
    }

    private fetchArticles(): void {
        this.articleService.getAllArticles().subscribe({
            next: (response: any) => {
                console.log('Дані з сервера:', response); // Дивимось в консоль (F12)
                
                // Розумна перевірка формату даних
                if (Array.isArray(response)) {
                    this.newsList.set(response); // Якщо це чистий масив
                } else if (response && response.data && Array.isArray(response.data)) {
                    this.newsList.set(response.data); // Якщо дані лежать у полі data
                } else if (response && response.articles && Array.isArray(response.articles)) {
                    this.newsList.set(response.articles); // Якщо дані лежать у полі articles
                } else {
                    console.warn('Невідомий формат даних', response);
                    this.newsList.set([]); 
                }
            },
            error: (err) => console.error('Помилка завантаження новин', err)
        });
    }

    protected goToCreate(): void {
        this.router.navigate(['/manage-articles']);
    }

    protected handleEdit(event: Event, item: NewsItem): void {
        event.stopPropagation();
        const targetId = item._id || item.id;
        if (targetId) {
            this.router.navigate(['/manage-articles', targetId]);
        }
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
    
    protected goToArticle(item: NewsItem): void {
        const targetId = item._id || item.id;
        if (targetId) {
            this.router.navigate(['../article', targetId], { relativeTo: this.route });
        }
    }
}