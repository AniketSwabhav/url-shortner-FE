import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule,RouterModule, MatSnackBarModule]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private authService: LoginService, private router: Router, private fb: FormBuilder,  private snackbarService: SnackbarService) {
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
      next: (response:any) => {
        if (response.token) {
          this.authService.setToken(response.token);
          const userId = response.id;
          console.log(response);

          if (this.authService.isAdmin()) {
            this.router.navigate(['admin/dashboard']);
            // alert("logged in successful")
            this.snackbarService.showSuccessSnackbar("Admin logged in successfully");
          } else {
            this.router.navigate(['user/dashboard']);
             this.snackbarService.showSuccessSnackbar("user logged in successfully");
          }
        } 
      },
      error : (err: any) => {
        console.error(err);
        this.snackbarService.showErrorSnackbar(err)
      }
  });
  }
}
