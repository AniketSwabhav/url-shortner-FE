import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserdashboardComponent } from './user/userdashboard/userdashboard.component';
import { AdmindashboardComponent } from './Admin/admindashboard/admindashboard.component';
import { adminGuard } from './auth/guards/admin.guard';
import { userGuard } from './auth/guards/user.guard';
import { SubscriptionComponent } from './Admin/subscription/subscription.component';
import { GetAllUrlComponent } from './user/get-all-url/get-all-url.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/subscription', component: SubscriptionComponent },

  { path: 'admin/dashboard', component: AdmindashboardComponent, canActivate: [adminGuard] },

  { path: 'user/dashboard', component: UserdashboardComponent, canActivate: [userGuard] },
  { path: 'user/:userId/urls', component: GetAllUrlComponent, canActivate: [userGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
