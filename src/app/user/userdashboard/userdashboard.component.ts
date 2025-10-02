import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  userId: string | null = '';
  userProfile: any;
  editData: any = {};
  confirmDeleteChecked: boolean = false;
  flash: { type: string; message: string } = { type: '', message: '' };

  // Modal visibility flags
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.getProfile();
    } else {
      this.showFlash('danger', 'User ID not found in token.');
    }
  }

  getProfile(): void {
    this.userService.viewUser(this.userId!).subscribe({
      next: (response) => {
        this.userProfile = response;
        console.log('User Profile:', response); // Check the structure

        // Initialize edit data
        this.editData = {
          firstName: response.firstName,
          lastName: response.lastName,
          phoneNo: response.phoneNo,
          email: response.email
        };
      },
      error: (err) => {
        this.showFlash('danger', 'Failed to load profile');
        console.error('Profile error:', err);
      }
    });
  }

  openEditModal(): void {
    this.editData = {
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      phoneNo: this.userProfile.phoneNo,
      email: this.userProfile.email
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  updateProfile(): void {
    if (!this.editData.firstName || !this.editData.lastName) {
      this.showFlash('danger', 'First name and last name are required');
      return;
    }

    // Prepare data for update (only send allowed fields)
    const updateData = {
      firstName: this.editData.firstName,
      lastName: this.editData.lastName,
      phoneNo: this.editData.phoneNo,
      email: this.editData.email
    };

    this.userService.updateUser(this.userId!, updateData).subscribe({
      next: () => {
        // this.showFlash('success', 'Profile updated successfully');
        this.snackbarService.showSuccessSnackbar("Profile updated successfully")
        this.getProfile();
        this.closeEditModal();
      },
      error: (err) => {
         this.closeEditModal();
        this.snackbarService.showErrorSnackbar(err?.error?.message || "failed to update profile");
        console.error('Update error:', err);
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
}