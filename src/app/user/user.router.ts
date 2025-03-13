import { Routes } from "@angular/router";
import { ListComponent } from "./components/list/list.component";
import { HomeComponent } from '../user/pages/home/home.component';

export const UserRouter: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'list',
      }
    ]
  }
];
