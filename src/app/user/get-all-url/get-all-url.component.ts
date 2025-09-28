import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlService } from 'src/app/service/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-get-all-url',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule, NgbModalModule, ReactiveFormsModule],
  templateUrl: './get-all-url.component.html',
  styleUrls: ['./get-all-url.component.css']
})
export class GetAllUrlComponent implements OnInit {
  userId: string | null = null;
  urls: any[] = [];
  newLongUrl: string = '';
  userProfile: any;
  isAdminMode: boolean = false;

  // Search
  searchForm: FormGroup;

  // Pagination
  limit: number = 5;
  offset: number = 0;
  totalUrlRecords: number = 0;
  currentPage: number = 0;

  flash: { type?: string; message: string } = { message: "" };

  @ViewChild('renewUrlModal') renewUrlModal: any;
  modelRef: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private ngbModal: NgbModal,
    private fb: FormBuilder,
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.limit = +params['limit'] || 5;
      this.offset = +params['offset'] || 0;
      this.currentPage = this.offset + 1;

      const searchParam = params['search'] || '';
      this.searchForm.get('searchTerm')?.setValue(searchParam);

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
    let params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        limit: this.limit,
        offset: this.offset,
        search: searchTerm || null
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
    this.currentPage = pageNumber - 1;
    this.offset = pageNumber - 1;
    this.loadUrls();
  }

  copyShortUrl(shortUrl: string): void {
    const fullUrl = `http://localhost:8001/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
       this.snackbarService.showSuccessSnackbar("Short URL copied to clipboard!")
      setTimeout(() => this.flash = { message: "" }, 2000);
    }).catch(() => {
      this.flash = { type: "danger", message: "Failed to copy URL!" };
    });
  }

  searchUrls(): void {
    this.offset = 0;
    this.currentPage = 1;
    this.loadUrls();
  }

  clearSearch(): void {
    this.searchForm.get('searchTerm')?.setValue('');
    this.searchUrls();
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
      this.router.navigate(['/admin/dashboard']);
    } else {
      // fallback for user
    }
  }

  editUrl(url: any): void {
    const updatedUrl = prompt("Enter new long URL:", url.longUrl);
    if (!updatedUrl || updatedUrl.trim() === '') return;

    const payload = { longUrl: updatedUrl };
    this.urlService.updateUserById(url.id, payload).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar("URL updated successfully!");
        this.loadUrls();
      },
      error: err => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

  deleteUrl(urlId: string): void {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    this.urlService.deleteUrl(urlId).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar("URL deleted successfully!");
        this.loadUrls();
      },
      error: err => {
        this.snackbarService.showErrorSnackbar(err);
      }
    });
  }

}