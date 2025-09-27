import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css'],
})
export class RegisterAdminComponent {
  adminRegisterForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
  ) { }


  ngOnInit(): void {
    this.adminRegisterForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  get f() {
    return this.adminRegisterForm.controls;
  }

  onRegister() {
    if (this.adminRegisterForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly!';
      return;
    }

    const payload = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      phoneNo: this.f['phoneNo'].value,
      credential: {
        email: this.f['email'].value,
        password: this.f['password'].value
      }
    };

    this.registerService.registerAdmin(payload).subscribe({
      next: (response) => {
        console.log('Admin Registered:', response);
        this.successMessage = 'Admin Registered successfully! ';
        this.errorMessage = '';

      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error?.message || 'Failed to egister Admin';

        setTimeout(() => {
          this.successMessage = '';
        }, 2000);

      }
    });

  }
}