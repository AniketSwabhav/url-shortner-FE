import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserdashboardComponent } from './user/userdashboard/userdashboard.component';
import { AdmindashboardComponent } from './Admin/admindashboard/admindashboard.component';
import { adminGuard } from './auth/guards/admin.guard';
import { userGuard } from './auth/guards/user.guard';
import { SubscriptionComponent } from './Admin/subscription/subscription.component';
import { GetAllUrlComponent } from './user/get-all-url/get-all-url.component';
import { ProfileComponent } from './user/profile/profile.component';
import { TransactionsComponent } from './user/transactions/transactions.component';
import { RegisterAdminComponent } from './Admin/register-admin/register-admin.component';
import { RevenueComponent } from './Admin/revenue/revenue.component';
import { UserResearchComponent } from './Admin/user-research/user-research.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/adminRegister', component: RegisterAdminComponent },
  { path: 'admin/subscription', component: SubscriptionComponent },
  { path: 'admin/revenue', component: RevenueComponent },
  { path: 'admin/userResearch', component: UserResearchComponent },


  { path: 'admin/dashboard', component: AdmindashboardComponent, canActivate: [adminGuard] },

  { path: 'user/dashboard', component: UserdashboardComponent, canActivate: [userGuard] },
  { path: 'user/urls', component: GetAllUrlComponent, canActivate: [userGuard] },
  { path: 'user/profile', component: ProfileComponent, canActivate: [userGuard] },
  { path: 'user/:userId/transactions', component: TransactionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
