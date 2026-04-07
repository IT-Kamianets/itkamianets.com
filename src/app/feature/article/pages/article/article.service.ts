import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsItem {
    id?: string;
    _id?: string; // MongoDB зазвичай повертає _id
    title: string;
    content: string;
    imageUrl: string;
    createdAt?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private http = inject(HttpClient);
    private apiUrl = 'https://api.webart.work/api/itarticle';

    getAllArticles(): Observable<NewsItem[]> {
        return this.http.get<NewsItem[]>(`${this.apiUrl}/get`);
    }

    getArticleById(id: string): Observable<NewsItem> {
        return this.http.post<NewsItem>(`${this.apiUrl}/fetch`, { id });
    }

    createArticle(article: Partial<NewsItem>): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, article);
    }

    updateArticle(article: Partial<NewsItem>): Observable<any> {
        return this.http.post(`${this.apiUrl}/update`, article);
    }

    deleteArticle(id: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/delete`, { id });
    }
}