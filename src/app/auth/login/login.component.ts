import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule,RouterModule, MatSnackBarModule]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private authService: LoginService, 
    private router: Router, 
    private fb: FormBuilder,  
    private snackbarService: SnackbarService,
    private jwtHelper: JwtHelperService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void { }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        if (response.token) {
          const decodedToken = this.jwtHelper.decodeToken(response.token);

          if (decodedToken?.IsActive === false || decodedToken?.IsActive === 'false') {
            this.snackbarService.showErrorSnackbar("Your account is inactive. Please contact admin.");
            return; // stop here, don’t set token or navigate
          }

          this.authService.setToken(response.token);

          if (this.authService.isAdmin()) {
            this.router.navigate(['admin/dashboard']);
            this.snackbarService.showSuccessSnackbar("Admin logged in successfully");
          } else {
            this.router.navigate(['user/dashboard']);
            this.snackbarService.showSuccessSnackbar("User logged in successfully");
          }
        }
      },
      error: (err: any) => {
        console.error(err);
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }
}
