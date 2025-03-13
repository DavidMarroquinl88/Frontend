import { Routes } from "@angular/router";
import { HomeComponent } from "./page/home/home.component";

export const PagesRouter: Routes = [

  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'branch',
        loadChildren: () => import('../branch/branch.router').then(m => m.BranchRouter)
      },
      {
        path: 'store',
        loadChildren: () => import('../store/store.router').then(m => m.StoreRouter)
      },
      {
        path: 'article',
        loadChildren: () => import('../article/article.router').then(m => m.ArticleRouter)
      },
      {
        path: 'inventory',
        loadChildren: () => import('../inventory/invetory.router').then(m => m.InventoryRouter)
      },
      {
        path: 'user',
        loadChildren: () => import('../user/user.router').then(m => m.UserRouter)
      },
      {
        path: 'shopping',
        loadChildren: () => import('../shopping/shopping.router').then(m => m.ShoppingRouter)
      },
      {
        path: '',
        redirectTo: 'store',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'store',
      }
    ]
  }

];
