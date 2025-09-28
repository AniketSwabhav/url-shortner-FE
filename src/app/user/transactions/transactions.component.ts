import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { HttpParams } from '@angular/common/http';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  userId: string | null = null;
  transactions: any[] = [];

  // Pagination
  limit: number = 5;
  offset: number = 0;
  totalTransactionRecords: number = 0;
  currentPage: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.limit = +params['limit'] || 5;
      this.offset = +params['offset'] || 0;
      this.currentPage = this.offset + 1;

      // Determine userId from route param or localStorage
      this.route.paramMap.subscribe(pm => {
        const paramUserId = pm.get('userId');
        if (paramUserId) {
          this.userId = paramUserId;
        } else {
          this.userId = localStorage.getItem('userId');
        }
      });

      if (!this.userId) {
        this.snackbarService.showErrorSnackbar('User not identified.');
        this.router.navigate(['/login']);
        return;
      }

      this.fetchTransactions();
    });
  }

  fetchTransactions(): void {
    if (!this.userId) {
      return;
    }

    const params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        limit: this.limit,
        offset: this.offset
      },
      queryParamsHandling: 'merge'
    });

    this.userService.getTransactions(this.userId, params)
      .subscribe({
        next: (response) => {
          this.transactions = response.body || [];
          const totalCountHeader = response.headers.get("X-Total-Count");
          this.totalTransactionRecords = totalCountHeader
            ? parseInt(totalCountHeader, 10)
            : 0;
        },
        error: (err) => {
          this.snackbarService.showErrorSnackbar(err);
        }
      });
  }

  goBack(): void {
    const hasParam = this.route.snapshot.paramMap.has('userId');
    if (hasParam) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/user/wallet']);
    }
  }

  changePage(pageNumber: number): void {
    if (pageNumber < 1) {
      return;
    }
    this.currentPage = pageNumber - 1;
    this.offset = pageNumber - 1;
    this.fetchTransactions();
  }
}
