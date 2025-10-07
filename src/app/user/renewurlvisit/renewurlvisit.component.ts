import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/service/user.service';
import { UrlService } from 'src/app/service/url.service';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-renewurlvisit',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './renewurlvisit.component.html',
  styleUrls: ['./renewurlvisit.component.css']
})
export class RenewurlvisitComponent implements OnInit {

  userId: string | null = '';
  urlId: string = '';
  renewVisitCount: number = 0;
  walletBalance: number = 0;
  visitPrice: number = 0;

  @ViewChild('addMoneyModal') addMoneyModal: any;
  modelRef: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private urlService: UrlService,
    private subscriptionService: SubscriptionService,
    private snackbarService: SnackbarService,
    private ngbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.urlId = this.route.snapshot.paramMap.get('urlId') || '';

    if (this.userId) {
      this.loadWallet();
      this.loadSubscription();
    } else {
      this.snackbarService.showErrorSnackbar('User not logged in.');
      this.router.navigate(['/login']);
    }
  }

  loadWallet(): void {
    this.userService.getWalletAmount(this.userId!).subscribe({
      next: (amount: number) => this.walletBalance = amount,
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err)
      }
    });
  }

  loadSubscription(): void {
    this.subscriptionService.getSubscription(this.userId!).subscribe({
      next: (res) => this.visitPrice = res.extraVisitPrice,
      error: (err) =>
        this.snackbarService.showErrorSnackbar(
          err?.error?.message || 'Failed to load subscription pricing'
        )
    });
  }

  renewVisits(): void {
    if (!this.urlId || this.renewVisitCount <= 0) {
      this.snackbarService.showErrorSnackbar('Please enter a valid renewal count');
      return;
    }

    this.urlService.renewVisits(this.urlId, this.renewVisitCount).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar('Visits renewed successfully!');
        this.router.navigate(['/user/urls']);
      },
      error: (err) => {
        const apiMessage = err?.error?.message?.toLowerCase() || '';
        if (apiMessage.includes('insufficient balance')) {
          this.openAddMoneyModal();
        } else {
          this.snackbarService.showErrorSnackbar(err?.error?.message || 'Renewal failed');
        }
      }
    });
  }

  openAddMoneyModal(): void {
    const options: NgbModalOptions = { size: 'md' };
    this.modelRef = this.ngbModal.open(this.addMoneyModal, options);
  }

  redirectToWallet(): void {
    this.router.navigate(['/user/wallet']);
  }

  goBack(): void {
    this.router.navigate(['/user/urls']);
  }

  
  
   preventDecimal(event: KeyboardEvent): void {
  if (event.key === '.' || event.key === ',' || event.key === 'e') {
    event.preventDefault();
  }
}
}
