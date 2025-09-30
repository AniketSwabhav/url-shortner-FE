import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/service/user.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-renewurl',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './renewurl.component.html',
  styleUrls: ['./renewurl.component.css']
})
export class RenewurlComponent implements OnInit {

  userId: string | null = '';
  renewUrlCount: number = 0;
  walletBalance: number = 0;
  newUrlPrice: number = 0;

  @ViewChild('addMoneyModal') addMoneyModal: any;
  modelRef: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private subscriptionService: SubscriptionService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.loadUserWallet();
      this.loadSubscription();
    } else {
      this.snackbarService.showErrorSnackbar('User not logged in.');
      this.router.navigate(['/login']);
    }
  }

  loadUserWallet(): void {
    this.userService.fetchWalletAmount(this.userId!).subscribe({
      next: (amount: number) => {
        this.walletBalance = amount;
      },
      error: () => {
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
        const apiMessage = err?.error?.message?.toLowerCase() || '';
        console.log("API Error =>", apiMessage);

        if (apiMessage.includes('insufficient balance')) {
          this.openAddMoneyModal();
        } else {
          this.snackbarService.showErrorSnackbar(apiMessage || 'Renewal failed');
        }
      }
    });
  }

  openAddMoneyModal(): void {
    const options: NgbModalOptions = {
      size: 'md'
    };
    this.modelRef = this.ngbModal.open(this.addMoneyModal, options);
  }

  redirectRenewUrls(): void {
    this.router.navigate(['/user/wallet']);
  }

  goBack(): void {
    this.router.navigate(['/user/dashboard']);
  }

  preventDecimal(event: KeyboardEvent): void {
  if (event.key === '.' || event.key === ',' || event.key === 'e') {
    event.preventDefault();
  }
}
}
