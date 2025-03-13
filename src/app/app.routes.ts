import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path:'authentication',
    loadChildren: () => import('./authentication/authentication.router').then(m => m.AuthenticationRouter)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.router').then(m => m.PagesRouter)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.router').then(m => m.PagesRouter)
  },
  {
    path : '',
    redirectTo: 'authentication',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'authentication'
  }

];
