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
  userId: string | null = null;   // will be set from route or storage
  urls: any[] = [];
  urlsCount: number = 0;
  newLongUrl: string = '';
  userProfile: any;
  isAdminMode: boolean = false;

  limit: number = 5;
  offset: number = 0;
  currentPage: number = 0;
  totalUrlRecords: number = 0;
  // totalTransactionRecords: number = 0;
  selectedButtonIndex: number | null = null;
  flash: { type?: string; message: string } = { message: "" };

  @ViewChild('renewUrlModal') renewUrlModal: any;
  modelRef: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private ngbModal: NgbModal
  ) {}

  ngOnInit() {
    // Determine userId: from route param if present, else fallback to localStorage
    this.route.paramMap.subscribe(params => {
      const paramUserId = params.get('userId');
      if (paramUserId) {
        // Admin context
        this.isAdminMode = true;
        this.userId = paramUserId;
      } else {
        // User context
        this.isAdminMode = false;
        this.userId = localStorage.getItem('userId');
      }

      if (!this.userId) {
        this.snackbarService.showErrorSnackbar('User ID not found.');
        // You may redirect to login or another page
        return;
      }

      // Once userId is known, fetch profile and URLs
      this.getProfile();
      this.route.queryParams.subscribe(q => {
        this.offset = parseInt(q['offset'] || '0', 10);
        this.limit = parseInt(q['limit'] || '5', 10);
        this.fetchUrls();
      });
    });
  }

  getProfile(): void {
    if (!this.userId) return;
    this.userService.viewUser(this.userId).subscribe({
      next: (response) => {
        this.userProfile = response;
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  fetchUrls(): void {
    if (!this.userId) return;

    const params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { limit: this.limit, offset: this.offset },
      queryParamsHandling: 'merge'
    });

    this.urlService.viewAllUrlsByUserId(this.userId, params).subscribe({
      next: (response) => {
        this.urls = response.body || [];
        const totalCountHeader = response.headers.get("X-Total-Count");
        this.totalUrlRecords = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  copyShortUrl(shortUrl: string): void {
    const fullUrl = `http://localhost:8001/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.flash = { type: "success", message: "Short URL copied to clipboard!" };
      setTimeout(() => this.flash = { message: "" }, 2000);
    }).catch(() => {
      this.flash = { type: "danger", message: "Failed to copy URL!" };
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

  goBack(): void {
  if (this.isAdminMode) {
    // e.g. return to admin user list
    this.router.navigate(['/admin/dashboard']);
  } else {
    // no back button or a fallback
    // this.router.navigate(['/user/urls']);
  }
}


  changePage(pageNumber: number): void {
    this.currentPage = pageNumber - 1;
    this.offset = this.currentPage * this.limit;
    this.fetchUrls();
  }
}
