import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AdmindashboardService, User } from 'src/app/service/admindashboard.service';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent, RouterModule],
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
    private fb: FormBuilder,
    private snackbarService: SnackbarService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['search']) this.searchForm.get('searchTerm')?.setValue(params['search']);
      this.limit = +params['limit'] || 5;
      this.offset = +params['offset'] || 0;
      this.currentPage = this.offset + 1;
      this.loadUsers();
      const searchParam = params['search'] || '';
      this.searchForm.get('searchTerm')?.setValue(searchParam);


    });
  }

  get startItem(): number {
    return this.totalUserRecords === 0 ? 0 : this.offset + 1;
  }

  get endItem(): number {
    const possibleEnd = this.offset + this.users.length;
    return possibleEnd > this.totalUserRecords ? this.totalUserRecords : possibleEnd;
  }

  onDisableClick(userID: string) {
    this.adminService.viewUser(userID).subscribe(user => {
      user.isActive = false;

      if (!user.firstName || !user.lastName || !user.phoneNo) {
        this.flash = { type: 'danger', message: 'Missing required user data' };
        setTimeout(() => (this.flash = { type: '', message: '' }), 3000);
        return;
      }

      this.adminService.updateUser(userID, user).subscribe(() => {
       this.snackbarService.showSuccessSnackbar("User has been disabled.")

        const localUser = this.users.find(u => u.id === userID);
        if (localUser) localUser.isActive = false;
      });
    });
  }

  onReviveClick(userID: string) {
    this.adminService.viewUser(userID).subscribe(user => {
      user.isActive = true;
      this.adminService.updateUser(userID, user).subscribe(() => {
        this.snackbarService.showSuccessSnackbar("User has been revived.")
        const localUser = this.users.find(u => u.id === userID);
        if (localUser) localUser.isActive = true;
      });
    });
  }

  loadUsers(): void {
    let params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) params = params.set('search', searchTerm);

      this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        limit: this.limit,
        offset: this.offset,
        search: searchTerm || null

      },
      queryParamsHandling: 'merge',
    });



    this.adminService.getAllUsers(params).subscribe({
      next: (response) => {
        this.users = response.body || [];
         const totalCountHeader = response.headers.get('X-Total-Count');
        // this.totalUserRecords = parseInt(response.headers.get('X-Total-Count') || '0');
        this.totalUserRecords = totalCountHeader ? + totalCountHeader :0;
      }, 
      error: err => {
       this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber - 1;
    this.offset = pageNumber - 1;
    // this.offset = (pageNumber - 1) * this.limit;
    this.loadUsers();
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
    this.router.navigate(['admin', 'transactions', userID,]);
  }

  onViewUrlClick(userID: string) {
    this.router.navigate(['admin', 'urls', userID]);
  }

  deleteUser(userId: string): void {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.snackbarService.showSuccessSnackbar("User deleted sucessfully")
          this.loadUsers();
        },
        error: () => {
           this.snackbarService.showErrorSnackbar("failed to deleted user")
        }
      });
    }
  }

}
