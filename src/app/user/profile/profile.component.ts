import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/service/user.service';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { HttpParams } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string | null = '';
  userProfile: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private loginService: LoginService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.userId = this.loginService.getUserId(); // assuming your LoginService has this
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
}