import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./auth/auth.guard";
import {HomeComponent} from "./home/home.component";
import {ForgotPasswordComponent} from "./auth/forgot-password/forgot-password.component";
import {NotFoundComponent} from "./not-found/not-found.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: "full"},
  {path: 'auth', pathMatch: "full", component: AuthComponent},
  {path: 'auth/resetpassword/:token', component: ForgotPasswordComponent},
  {path: 'home',canActivate: [AuthGuard], component: HomeComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
