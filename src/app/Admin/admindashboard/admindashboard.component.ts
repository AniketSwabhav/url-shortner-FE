import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AdmindashboardService, User } from 'src/app/service/admindashboard.service';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
})
export class AdmindashboardComponent implements OnInit {
  users: User[] = [];
  totalUserRecords: number = 0; 
  usersCount: number = 0; 
  selectedButtonIndex: number = 0;

  flash: { type: string; message: string } = { type: '', message: '' };

  limit: number = 5;
  offset: number = 0;
  currentPage: number = 1;

  searchForm: FormGroup;

  constructor(
    private adminService: AdmindashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['search']) this.searchForm.get('searchTerm')?.setValue(params['search']);
      if (params['limit']) this.limit = +params['limit'];
      if (params['offset']) {
        this.offset = +params['offset'];
        this.currentPage = Math.floor(this.offset / this.limit) + 1;
      }
      this.loadUsers();
    });
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.offset = (pageNumber - 1) * this.limit;
    this.loadUsers();
  }

  get startItem(): number {
    return this.totalUserRecords === 0 ? 0 : this.offset + 1;
  }

  get endItem(): number {
    const possibleEnd = this.offset + this.users.length;
    return possibleEnd > this.totalUserRecords ? this.totalUserRecords : possibleEnd;
  }

  loadUsers(): void {
    let params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) params = params.set('search', searchTerm);

    this.adminService.getAllUsers(params).subscribe({
      next: (response) => {
        this.users = response.body || [];
        this.usersCount = this.users.length;
        this.totalUserRecords = parseInt(response.headers.get('X-Total-Count') || '0');
      },
      error: () => {
        this.flash = { type: 'danger', message: 'Failed to load users' };
        setTimeout(() => this.flash = { type: '', message: '' }, 3000);
      }
    });
  }

  searchUsers(): void {
    this.offset = 0;
    this.currentPage = 1;
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchForm.get('searchTerm')?.setValue('');
    this.searchUsers();
  }

  onTransactionClick(userID: string) {
    this.router.navigate(['user', userID, 'transactions']);
  }

  deleteUser(userId: string): void {
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.flash = { type: 'success', message: 'User deleted successfully' };
        setTimeout(() => this.flash = { type: '', message: '' }, 3000);
        this.loadUsers();
      },
      error: () => {
        this.flash = { type: 'danger', message: 'Failed to delete user' };
        setTimeout(() => this.flash = { type: '', message: '' }, 3000);
      }
    });
  }
}
