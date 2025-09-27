import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { HttpParams } from '@angular/common/http';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { LoginService } from 'src/app/service/login.service';

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
  transactionCount: number = 0;

  // Pagination
  limit: number = 5;
  offset: number = 0;
  currentPage: number = 1;
  totalTransactionRecords: number = 0;
  selectedButtonIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const paramUserId = params.get('userId');
      if (paramUserId) {
        this.userId = paramUserId;
      } else {
        this.userId = localStorage.getItem('userId');
      }

      if (!this.userId) {
        this.snackbarService.showErrorSnackbar('User not identified.');
        this.router.navigate(['/login']);
        return;
      }
      this.route.queryParams.subscribe(q => {
        this.offset = parseInt(q['offset'] || '0', 10);
        this.limit = parseInt(q['limit'] || '5', 10);
        this.currentPage = Math.floor(this.offset / this.limit) + 1;
        this.fetchTransactions();
      });
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
      queryParams: { limit: this.limit, offset: this.offset },
      queryParamsHandling: 'merge'
    });

    this.userService.getTransactions(this.userId, params)
      .subscribe({
        next: (data) => {
          this.transactions = data.body || [];
          const totalCountHeader = data.headers.get("X-Total-Count");
          this.totalTransactionRecords = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
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
    this.currentPage = pageNumber;
    this.offset = (pageNumber - 1) * this.limit;
    this.fetchTransactions();
  }
}