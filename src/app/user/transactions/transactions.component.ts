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
  userId: string | null = '';
  transactions: any[] = [];
  transactionCount: number = 0;

  //Pagination
  limit: number = 5
  offset: number = 0
  currentPage: number = 0
  totalTransactionRecords: number = 0
  selectedButtonIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private loginService: LoginService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // this.userId = this.route.snapshot.params['id'];
      this.userId = this.loginService.getUserId();
      this.offset = parseInt(params['offset'] || '0');
      this.limit = parseInt(params['limit'] || '5');
      this.fetchTransactions();
    });
  }

  fetchTransactions() {
    const params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        limit: this.limit,
        offset: this.offset
      },
      queryParamsHandling: 'merge',
    });
    this.userService.getTransactions(this.userId!, params).subscribe({
      next: (data) => {
        console.log("transaction data", data)
        this.transactions = data.body;
        this.totalTransactionRecords = parseInt(data.headers.get("X-Total-Count"));
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  changePage(pageNumber: number): void {
    console.log(pageNumber);

    this.currentPage = pageNumber - 1;
    this.offset = (pageNumber - 1);
    console.log(pageNumber, this.offset);
    this.fetchTransactions();
  }
}
