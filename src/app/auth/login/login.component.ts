import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule,RouterModule]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private authService: LoginService, private router: Router, private fb: FormBuilder) {
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
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        if (response.token) {
          this.authService.setToken(response.token);
          const userId = response.id;
          console.log(response);

          if (this.authService.isAdmin()) {
            this.router.navigate(['admin/dashboard']);
          } else {
            this.router.navigate(['user/dashboard']);
          }
        } else {
          alert("INVALID Login Details ")
        }
      },
      error => {
        alert("INVALID Login Details ")
      }
    );
  }
}
