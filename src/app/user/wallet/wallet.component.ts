import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  userId: string | null = '';
  userProfile: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.getProfile();
    } else {
      this.snackbarService.showErrorSnackbar('User ID not found in token.');
    }
  }

  getProfile(): void {
    this.userService.viewUser(this.userId!).subscribe({
      next: (response) => {
        this.userProfile = response;
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  onTransactionClick(userID: string) {
    this.router.navigate(['user', userID, 'transactions']);
  }

  amount: number = 0;
  isProcessing: boolean = false;

  addToWallet(): void {
    if (!this.amount || this.amount <= 0) {
      this.snackbarService.showErrorSnackbar("Please enter a valid amount.");
      return;
    }

    this.isProcessing = true;
    this.userService.addAmount(this.userId!, this.amount).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar("Amount added successfully!");
        this.getProfile();
        this.amount = 0;
        this.isProcessing = false;
      },
      error: (err) => {
        this.isProcessing = false;
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  withdrawFromWallet(): void {
    if (!this.amount || this.amount <= 0) {
      this.snackbarService.showErrorSnackbar("Please enter a valid amount.");
      return;
    }

    this.isProcessing = true;
    this.userService.withdrawAmount(this.userId!, this.amount).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar("Amount withdrawn successfully!");
        this.getProfile();
        this.amount = 0;
        this.isProcessing = false;
      },
      error: (err) => {
        this.isProcessing = false;
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }
}
