import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdmindashboardService,
  User,
} from 'src/app/service/admindashboard.service';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
})
export class AdmindashboardComponent implements OnInit {
  users: User[] = [];
  flash: { type: string; message: string } = { type: '', message: '' };

  limit: number = 5;
  offset: number = 0;
  currentPage: number = 1;
  totalUserRecords: number = 0;

  constructor(
    private adminService: AdmindashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.offset = (pageNumber - 1) * this.limit;
    this.loadUsers();
  }

  loadUsers(): void {
    const params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    this.adminService.getAllUsers(params).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.users = response;
        this.totalUserRecords = response.length;

        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { limit: this.limit, offset: this.offset },
          queryParamsHandling: 'merge',
        });
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.flash = { type: 'danger', message: 'Failed to load users' };
      },
    });
  }

  updateUser(user: User): void {
    this.adminService.updateUser(user.id, user).subscribe({
      next: () => {
        this.flash = { type: 'success', message: 'User updated successfully' };
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.flash = { type: 'danger', message: 'Failed to update user' };

      },
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
      },
    });
  }
}
