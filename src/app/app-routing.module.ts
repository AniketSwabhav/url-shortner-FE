import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserdashboardComponent } from './user/userdashboard/userdashboard.component';
import { AdmindashboardComponent } from './user/admindashboard/admindashboard.component';
import { adminGuard } from './auth/guards/admin.guard';
import { userGuard } from './auth/guards/user.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'admin/dashboard', component: AdmindashboardComponent , canActivate: [adminGuard]},

  { path: 'user/dashboard', component: UserdashboardComponent , canActivate: [userGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
