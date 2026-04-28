import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'articles',
        loadComponent: () =>
            import('./pages/articles/articles.component').then(
                (m) => m.ArticlesComponent
            ),
    },
    {
        path: 'article/:id',
        loadComponent: () =>
            import('./pages/article/article.component').then(
                (m) => m.ArticleComponent
            ),
    },
    {
        path: 'manage-articles',
        loadComponent: () =>
            import('./pages/manage-articles/manage-articles.component').then(
                (m) => m.ManageArticlesComponent
            ),
    },
    {
        path: 'manage-articles/:id',
        loadComponent: () =>
            import('./pages/manage-articles/manage-articles.component').then(
                (m) => m.ManageArticlesComponent
            ),
    }
];