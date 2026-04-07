import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'; // Додано для форматування дати

interface NewsItem {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt?: number; // Додано поле дати
}

@Component({
    selector: 'app-article',
    standalone: true,
    imports: [DatePipe], // Підключаємо DatePipe
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    protected readonly article = signal<NewsItem | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        const savedData = localStorage.getItem('my_articles_db');
        
        if (savedData && id) {
            try {
                const allArticles: NewsItem[] = JSON.parse(savedData);
                const foundArticle = allArticles.find(item => item.id === id);
                
                if (foundArticle) {
                    // Якщо це стара новина без createdAt, беремо час створення з її id
                    if (!foundArticle.createdAt) {
                        foundArticle.createdAt = parseInt(foundArticle.id, 10);
                    }
                    this.article.set(foundArticle);
                }
            } catch (error) {
                console.error('Помилка завантаження новини з LocalStorage:', error);
            }
        }
    }

    protected goBack(): void {
        this.router.navigate(['/articles']);
    }
}