import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ListComponent } from "./components/list/list.component";

export const BranchRouter : Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path:'list',
        component:ListComponent
      },
      {
        path:'',
        redirectTo:'list',
        pathMatch:'full'
      },
      {
        path:'**',
        redirectTo:'list',
      }
    ]
  }
];
