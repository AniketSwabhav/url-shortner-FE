import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlService } from 'src/app/service/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-get-all-url',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule, NgbModalModule],
  templateUrl: './get-all-url.component.html',
  styleUrls: ['./get-all-url.component.css']
})
export class GetAllUrlComponent implements OnInit {
  userId: string | null = '';
  urls: any[] = [];
  urlsCount: number = 0;
  newLongUrl: string = '';
  userProfile: any;

  limit: number = 5;
  offset: number = 0;
  currentPage: number = 0;
  totalTransactionRecords: number = 0;
  selectedButtonIndex: number | null = null;

  @ViewChild('renewUrlModal') renewUrlModal: any;
  modelRef: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private ngbModal: NgbModal
  ) {
    // ✅ Directly get userId from localStorage
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    if (!this.userId) {
      this.snackbarService.showErrorSnackbar('User ID not found.');
      return;
    }

    this.getProfile();
    this.fetchUrls();

    this.route.queryParams.subscribe(params => {
      this.offset = parseInt(params['offset'] || '0');
      this.limit = parseInt(params['limit'] || '5');
      this.fetchUrls();
    });
  }

  getProfile(): void {
    this.userService.viewUser(this.userId!).subscribe({
      next: (response) => {
        this.userProfile = response;
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  fetchUrls(): void {
    const params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { limit: this.limit, offset: this.offset },
      queryParamsHandling: 'merge'
    });

    this.urlService.viewAllUrlsByUserId(this.userId!, params).subscribe({
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
        const errorMsg = err?.error || 'An error occurred.';
        if (errorMsg.includes('maximum url creation limit')) {
          this.openRenewModal();
        } else {
          this.snackbarService.showErrorSnackbar(errorMsg);
        }
      }
    });
  }

  openRenewModal(): void {
    const options: NgbModalOptions = { size: 'md' };
    this.modelRef = this.ngbModal.open(this.renewUrlModal, options);
  }

  redirectRenewUrls(): void {
    this.router.navigate(['user/urls/renew']);
  }

  renewUrlVisit(urlId: string): void {
    this.router.navigate([`/user/url/${urlId}/renew-visits`]);
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber - 1;
    this.offset = this.currentPage;
    this.fetchUrls();
  }
}
