import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../article.service';
import { Article } from '../../article.interface'; // Імпортуємо правильний інтерфейс

@Component({
    selector: 'app-manage-articles',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './manage-articles.component.html',
    styleUrl: './manage-articles.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageArticlesComponent implements OnInit {
    private articleService = inject(ArticleService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    protected readonly formTitle = signal<string>('');
    protected readonly formContent = signal<string>('');
    protected readonly formImageUrl = signal<string>('');
    protected readonly editingId = signal<string | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.editingId.set(id);
            this.articleService.getArticleById(id).subscribe({
                next: (article) => {
                    this.formTitle.set(article.title);
                    this.formContent.set(article.content);
                    this.formImageUrl.set(article.imageUrl);
                },
                error: (err) => console.error('Помилка завантаження новини', err)
            });
        }
    }

    protected handleFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                this.formImageUrl.set(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    protected handleSave(): void {
        const title = this.formTitle().trim();
        const content = this.formContent().trim();
        const imageUrl = this.formImageUrl().trim();

        if (!title || !content) return;

        const currentId = this.editingId();
        const payload: Partial<Article> = {
            title,
            content,
            imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Немає+фото'
        };

        if (currentId) {
            payload.id = currentId;
            payload._id = currentId; // Для підстраховки (залежить від того, що чекає бекенд)
            
            this.articleService.updateArticle(payload).subscribe({
                next: () => this.goBack(),
                error: (err) => console.error(err)
            });
        } else {
            payload.createdAt = Date.now();
            this.articleService.createArticle(payload).subscribe({
                next: () => this.goBack(),
                error: (err) => console.error(err)
            });
        }
    }

    protected goBack(): void {
        this.router.navigate(['../articles'], { relativeTo: this.route });
    }
}