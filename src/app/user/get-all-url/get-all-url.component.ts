import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlService } from 'src/app/service/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';

declare var bootstrap: any; // For Bootstrap modal usage

@Component({
  selector: 'app-get-all-url',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule],
  templateUrl: './get-all-url.component.html',
  styleUrls: ['./get-all-url.component.css']
})
export class GetAllUrlComponent implements OnInit {
  urls: any[] = [];
  urlsCount: number = 0;
  newLongUrl: string = '';
  renewUrlCount: number = 1; // default

  limit: number = 5;
  offset: number = 0;
  currentPage: number = 0;
  totalTransactionRecords: number = 0;
  selectedButtonIndex: number | null = null;

  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private userService:UserService,
    private snackbarService: SnackbarService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.userId = this.loginService.getUserId();
    this.fetchUrls();

    this.route.queryParams.subscribe(params => {
      this.offset = parseInt(params['offset'] || '0');
      this.limit = parseInt(params['limit'] || '5');
      this.fetchUrls();
    });
  }

  fetchUrls() {
    const params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { limit: this.limit, offset: this.offset },
      queryParamsHandling: 'merge'
    });

    this.urlService.viewAllUrlsByUserId(params).subscribe({
      next: (response) => {
        this.urls = response.body;
        this.totalTransactionRecords = parseInt(response.headers.get("X-Total-Count"));
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  addNewUrl(): void {
    if (!this.newLongUrl.trim()) {
      this.snackbarService.showErrorSnackbar('Please enter a valid URL.');
      return;
    }

    this.urlService.addUrl(this.newLongUrl).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar('URL shortened successfully!');
        this.newLongUrl = '';
        this.fetchUrls();
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'An error occurred.';
        if (errorMsg.includes('maximum url creation limit')) {
          this.openRenewModal();
        } else {
          this.snackbarService.showErrorSnackbar(errorMsg);
        }
      }
    });
  }

  openRenewModal(): void {
    const modalEl = document.getElementById('renewUrlModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  renewUrls(): void {
    if (!this.userId || this.renewUrlCount <= 0) {
      this.snackbarService.showErrorSnackbar('Invalid renewal request');
      return;
    }

    this.userService.renewUrls(this.userId, this.renewUrlCount).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar('URLs renewed successfully!');
        const modalEl = document.getElementById('renewUrlModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
        this.fetchUrls();
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err?.error?.message || 'Renewal failed');
      }
    });
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber - 1;
    this.offset = (pageNumber - 1);
    this.fetchUrls();
  }
}
