import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
    showPassword: boolean = false; 


  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email,  Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get f() {
    return this.registerForm.controls;
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly!';
      return;
    }

    const payload = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      phoneNo: this.f['phoneNo'].value,
      email: this.f['email'].value,
      credential: {
        email: this.f['email'].value,
        password: this.f['password'].value
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