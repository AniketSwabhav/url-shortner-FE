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
 userId: string | null = null;
  urls: any[] = [];
  newLongUrl: string = '';
  userProfile: any;
  isAdminMode: boolean = false;

  // Pagination
  limit: number = 5;
  offset: number = 0;
  totalUrlRecords: number = 0;
  currentPage: number = 0;
  // selectedButtonIndex: number | null = null;

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
    this.route.queryParams.subscribe(params => {
      this.limit = +params['limit'] || 5;
      this.offset = +params['offset'] || 0;
      this.currentPage = this.offset + 1;

      this.route.paramMap.subscribe(pm => {
        const paramUserId = pm.get('userId');
        if (paramUserId) {
          this.isAdminMode = true;
          this.userId = paramUserId;
        } else {
          this.isAdminMode = false;
          this.userId = localStorage.getItem('userId');
        }
      });
      this.getProfile();
      this.loadUrls();
    });
  }

  getProfile(): void {
    if (!this.userId) return;
    this.userService.viewUser(this.userId).subscribe({
      next: resp => this.userProfile = resp,
      error: err => this.snackbarService.showErrorSnackbar(err)
    });
  }

  loadUrls(): void {
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

    this.urlService.viewAllUrlsByUserId(this.userId!, params).subscribe({
      next: resp => {
        this.urls = resp.body || [];
        const totalCountHeader = resp.headers.get('X-Total-Count');
        this.totalUrlRecords = totalCountHeader ? +totalCountHeader : 0;
      },
      error: err => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  changePage(pageNumber: number): void {
    // In the example you showed, offset is just pageNumber - 1 
    this.currentPage = pageNumber - 1;
    this.offset = pageNumber - 1;
    this.loadUrls();
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
        this.loadUrls();
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
  
}
