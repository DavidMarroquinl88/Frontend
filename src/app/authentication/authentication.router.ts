import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";

export const AuthenticationRouter: Routes = [
  {
    component: HomeComponent,
    path:'',
    children: [
      {
        component: LoginComponent,
        path: 'login'
      },
      {
        component: RegisterComponent,
        path: 'register'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  }
];