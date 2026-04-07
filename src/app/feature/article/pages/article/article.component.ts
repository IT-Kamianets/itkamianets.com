import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ArticleService } from '../../article.service';
import { Article } from '../../article.interface'; // Імпортуємо правильний інтерфейс

@Component({
    selector: 'app-article',
    standalone: true,
    imports: [DatePipe],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private articleService = inject(ArticleService);

    protected readonly article = signal<Article | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.articleService.getArticleById(id).subscribe({
                next: (data) => this.article.set(data),
                error: (err) => console.error('Помилка завантаження статті', err)
            });
        }
    }

    protected goBack(): void {
        this.router.navigate(['/articles']);
    }
}