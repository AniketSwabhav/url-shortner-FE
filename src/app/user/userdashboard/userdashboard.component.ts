import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/service/user.service';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  userId: string | null = '';
  userProfile: any;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private snackbarService: SnackbarService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.userId = this.loginService.getUserId();
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

  goToRenewPage(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  this.router.navigate(['/user/urls/renew']);
}


}
