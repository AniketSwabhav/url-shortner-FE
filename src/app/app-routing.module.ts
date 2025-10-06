import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserdashboardComponent } from './user/userdashboard/userdashboard.component';
import { AdmindashboardComponent } from './Admin/admindashboard/admindashboard.component';
import { adminGuard } from './auth/guards/admin.guard';
import { userGuard } from './auth/guards/user.guard';
import { SubscriptionComponent } from './Admin/subscription/subscription.component';
import { RegisterAdminComponent } from './Admin/register-admin/register-admin.component';
import { GetAllUrlComponent } from './user/get-all-url/get-all-url.component';
import { TransactionsComponent } from './user/transactions/transactions.component';
import { RenewurlComponent } from './user/renewurl/renewurl.component';
import { WalletComponent } from './user/wallet/wallet.component';
import { RenewurlvisitComponent } from './user/renewurlvisit/renewurlvisit.component';
import { RevenueComponent } from './Admin/revenue/revenue.component';
import { UserResearchComponent } from './Admin/user-research/user-research.component';
import { UserStatsComponent } from './Admin/user-stats/user-stats.component';
import { AddUrlComponent } from './user/add-url/add-url.component';
import { RedirectUrlComponent } from './user/redirect-url/redirect-url.component';
import { ReportsComponent } from './Admin/reports/reports.component';
import { UserreportComponent } from './user/userreport/userreport.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { path: 'admin/adminRegister', component: RegisterAdminComponent },
  { path: 'admin/subscription', component: SubscriptionComponent },
  { path: 'admin/revenue', component: RevenueComponent },
  { path: 'admin/userResearch', component: UserResearchComponent },
  { path: 'admin/user-stats', component: UserStatsComponent },
  { path: 'admin/report', component: ReportsComponent },
  { path: 'admin/transactions/:userId', component: TransactionsComponent },
  { path: 'admin/urls/:userId', component: GetAllUrlComponent },

  { path: 'admin/dashboard', component: AdmindashboardComponent, canActivate: [adminGuard] },

  { path: 'user/dashboard', component: UserdashboardComponent },
  { path: 'user/urls', component: GetAllUrlComponent, canActivate: [userGuard] },

  { path: 'user/urls/renew', component: RenewurlComponent, canActivate: [userGuard] },
  { path: 'user/transactions', component: TransactionsComponent },
  { path: 'user/wallet', component: WalletComponent, canActivate: [userGuard] },
  { path: 'user/url/:urlId/renew-visits', component: RenewurlvisitComponent },
  { path: 'user/add-url', component: AddUrlComponent},
  { path: 'user/reort', component: UserreportComponent},

  { path: 'redirect/:shorturl', component: RedirectUrlComponent}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
