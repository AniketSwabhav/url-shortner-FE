import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdmindashboardService, User } from 'src/app/service/admindashboard.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdmindashboardComponent implements OnInit {

  users: User[] = [];
  flash: { type: string, message: string } = { type: '', message: '' };

  constructor(private adminService: AdmindashboardService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => {
        console.error('Error loading users:', err);
        this.flash = { type: 'danger', message: 'Failed to load users' };
      }
    });
  }

  updateUser(user: User): void {
    this.adminService.updateUser(user.id, user).subscribe({
      next: () => {
        this.flash = { type: 'success', message: 'User updated successfully' };
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.flash = { type: 'danger', message: 'Failed to update user' };
      }
    });
  }

  deleteUser(userId: string): void {
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.flash = { type: 'success', message: 'User deleted successfully' };
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.flash = { type: 'danger', message: 'Failed to delete user' };
      }
    });
  }
}
