import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  firstName: string = '';
  lastName: string = '';
  phoneNo: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  onRegister() {
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNo: this.phoneNo,
      credential: {
        email: this.email,
        password: this.password
      }
    };

    this.registerService.registerUser(payload).subscribe({
      next: (response) => {
        console.log('User registered:', response);
        this.successMessage = 'User registered successfully! Redirecting to login...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error?.message || 'Failed to register user';
        this.successMessage = '';
      }
    });
  }
}
