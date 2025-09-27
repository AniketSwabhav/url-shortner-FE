import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/service/user.service';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-renewurl',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './renewurl.component.html',
  styleUrls: ['./renewurl.component.css']
})
export class RenewurlComponent implements OnInit {

  userId: string | null = '';
  renewUrlCount: number = 0;
  walletBalance: number = 0;
  newUrlPrice: number = 0;


  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private loginService: LoginService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit() {
    this.userId = this.loginService.getUserId();
    if (this.userId) {
      this.loadUserWallet();
       this.loadSubscription();
    }
  }

  loadUserWallet(): void {
    this.userService.fetchWalletAmount(this.userId!).subscribe({
      next: (amount: number) => {
        this.walletBalance = amount;
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar('Failed to fetch wallet balance');
      }
    });
  }

  loadSubscription(): void {
    this.subscriptionService.getSubscription(this.userId!).subscribe({
     next: (res) => {
      this.newUrlPrice = res.newUrlPrice;
     },
      error: (err) => {
       this.snackbarService.showErrorSnackbar(err.error?.message || 'Failed to load subscription');
      }
    });
  }


  renewUrls(): void {
    if (!this.userId || this.renewUrlCount <= 0) {
      this.snackbarService.showErrorSnackbar('Renewal number should be more than 0');
      return;
    }

    this.userService.renewUrls(this.userId, this.renewUrlCount).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar('URLs renewed successfully!');
        this.router.navigate(['/user/urls']);
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err?.error?.message || 'Renewal failed');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user/urls']);
  }

}
