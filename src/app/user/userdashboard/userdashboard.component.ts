import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Router } from '@angular/router';
import { AdmindashboardService } from 'src/app/service/admindashboard.service';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  userId: string | null = '';
  userProfile: any;
  editData: any = {};
  confirmDeleteChecked: boolean = false;
  flash: { type: string; message: string } = { type: '', message: '' };
  editForm!: FormGroup;

  // Modal visibility flags
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private router: Router,
    private adminService: AdmindashboardService
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

    // Initialize the form group
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: [{ value: '', disabled: true }]
    });

    if (this.userId) {
      this.getProfile();
    } else {
      console.log('User ID not found in token.');
    }
  }

  get f() {
    return this.editForm.controls;
  }

  getProfile(): void {
    this.userService.viewUser(this.userId!).subscribe({
      next: (response) => {
        this.userProfile = response;
        this.editForm.patchValue({
          firstName: response.firstName,
          lastName: response.lastName,
          phoneNo: response.phoneNo,
          email: response.email
        });
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err);
        console.error('Profile error:', err);
      }
    });
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  updateProfile(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const updateData = this.editForm.getRawValue(); // Includes disabled email
    this.userService.updateUser(this.userId!, updateData).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar("Profile updated successfully");
        this.getProfile();
        this.closeEditModal();
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err?.error?.message || "Failed to update profile");
        this.closeEditModal();
      }
    });
  }

  confirmDelete(): void {
    this.confirmDeleteChecked = false;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  deleteAccount(): void {
    if (!this.confirmDeleteChecked) {
      this.showFlash('warning', 'Please confirm deletion by checking the box');
      return;
    }

    this.userService.deleteUser(this.userId!).subscribe({
      next: () => {
        this.showFlash('success', 'Account deleted successfully');
        // this.loginService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.showFlash('danger', 'Failed to delete account');
        this.closeDeleteModal();
        console.error('Delete error:', err);
      }
    });
  }

  goToRenewPage(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/user/urls/renew']);
  }

  goToWalletPage(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/user/wallet']);
  }

  private showFlash(type: string, message: string): void {
    this.flash = { type, message };
    setTimeout(() => this.flash = { type: '', message: '' }, 3000);
  }



  deleteUser(userId: string): void {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.snackbarService.showSuccessSnackbar("User deleted sucessfully")
          this.getProfile();
        },
        error: (err) => {
          this.snackbarService.showErrorSnackbar(err.error.message)
        }
      });
    }
  }
}