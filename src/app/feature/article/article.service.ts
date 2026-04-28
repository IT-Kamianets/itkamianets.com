import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from './article.interface';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private http = inject(HttpClient);
    private readonly apiUrl = 'https://api.webart.work/api/itarticle';

    /** Отримати всі новини */
    getAllArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}/get?ts=${Date.now()}`);
    }

    /** Отримати конкретну новину за ID */
    getArticleById(id: string): Observable<Article> {
        return this.http.post<Article>(`${this.apiUrl}/fetch`, { id });
    }

    /** Створити нову статтю (тепер обов'язково передаємо companyId) */
    createArticle(article: Partial<Article>): Observable<any> {
        // Додаємо базові поля, якщо вони не передані
        const payload = {
            ...article,
            createdAt: Date.now(),
            views: 0
        };
        return this.http.post(`${this.apiUrl}/create`, payload);
    }

    /** Оновити існуючу статтю */
    updateArticle(article: Partial<Article>): Observable<any> {
        const payload = {
            ...article,
            updatedAt: Date.now()
        };
        return this.http.post(`${this.apiUrl}/update`, payload);
    }

    /** Видалити статтю */
    deleteArticle(id: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/delete`, { id });
    }
}