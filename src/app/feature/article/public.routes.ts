import { Routes } from '@angular/router';

export const routes: Routes = [{
                path: 'articles',
                loadComponent: () =>
                    import('./pages/articles/articles.component').then(
                        (m) => m.ArticlesComponent,
                    ),
            }
        ];