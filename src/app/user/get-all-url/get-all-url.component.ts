import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrlService } from 'src/app/service/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-get-all-url',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule],
  templateUrl: './get-all-url.component.html',
  styleUrls: ['./get-all-url.component.css']
})
export class GetAllUrlComponent implements OnInit {
  userId: string | null = '';
  urls: any[] = [];
  userProfile: any;
  isAdminMode: boolean = false;

  // Search
  searchTerm: string = '';

  // Edit URL Modal
  editData: any = {};
  showEditModal: boolean = false;
  isUpdating: boolean = false;

  // Pagination
  limit: number = 5;
  offset: number = 0;
  totalUrlRecords: number = 0;
  currentPage: number = 1;

  flash: { type: string; message: string } = { type: '', message: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private userService: UserService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.limit = +params['limit'] || 5;
      this.offset = +params['offset'] || 0;
      this.currentPage = Math.floor(this.offset / this.limit) + 1;
      this.searchTerm = params['search'] || '';

      this.route.paramMap.subscribe(pm => {
        const paramUserId = pm.get('userId');
        if (paramUserId) {
          this.isAdminMode = true;
          this.userId = paramUserId;
        } else {
          this.isAdminMode = false;
          this.userId = localStorage.getItem('userId');
        }

        this.getProfile();
        this.loadUrls();
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
        this.showFlash('danger', 'Failed to load profile');
      }
    });
  }

  loadUrls(): void {
    if (!this.userId) return;

    let params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('offset', this.offset.toString());

    if (this.searchTerm) {
      params = params.set('search', this.searchTerm);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        limit: this.limit,
        offset: this.offset,
        search: this.searchTerm || null
      },
      queryParamsHandling: 'merge',
    });

    this.urlService.viewAllUrlsByUserId(this.userId, params).subscribe({
      next: (resp) => {
        this.urls = resp.body || [];
        const totalCountHeader = resp.headers.get('X-Total-Count');
        this.totalUrlRecords = totalCountHeader ? +totalCountHeader : 0;
      },
      error: (err) => {
        this.showFlash('danger', 'Failed to load URLs');
      }
    });
  }

  changePage(pageNumber: number): void {
    this.offset = (pageNumber - 1) * this.limit;
    this.currentPage = pageNumber;
    this.loadUrls();
  }

  copyShortUrl(shortUrl: string): void {
    const fullUrl = `http://localhost:4200/redirect/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.snackbarService.showSuccessSnackbar('Short URL copied to clipboard!');
    }).catch(() => {
      this.snackbarService.showErrorSnackbar('Failed to copy URL');
    });
  }

  searchUrls(): void {
    this.offset = 0;
    this.currentPage = 1;
    this.loadUrls();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchUrls();
  }

  openEditModal(url: any): void {
    this.modalErrorMessage = '';
    this.showEditModal = true;
    this.editData = {
      id: url.id,
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      originalLongUrl: url.longUrl,
      originalShortUrl: url.shortUrl
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editData = {};
    this.isUpdating = false;
  }

  modalErrorMessage: string = '';

  // updateUrl(): void {
  //   if (!this.editData.longUrl || !this.editData.shortUrl) {
  //     this.showFlash('warning', 'Please fill all required fields');
  //     return;
  //   }

  //   this.isUpdating = true;

  //   const payload = {
  //     longUrl: this.editData.longUrl,
  //     shortUrl: this.editData.shortUrl
  //   };

  //   this.urlService.updateUrl(this.editData.id, payload).subscribe({
  //     next: (response) => {
  //       this.snackbarService.showSuccessSnackbar("URL updated successfully!")
  //       this.closeEditModal();
  //       this.loadUrls();
  //     },
  //     error: (err) => {
  //       this.snackbarService.showErrorSnackbar(err)
  //       this.closeEditModal();
  //       this.isUpdating = false;
  //     },
  //     complete: () => {
  //       this.isUpdating = false;
  //     }
  //   });
  // }

  updateUrl(): void {
    this.modalErrorMessage = '';

    if (!this.editData.longUrl || !this.editData.shortUrl) {
      this.showFlash('warning', 'Please fill all required fields');
      return;
    }

    this.isUpdating = true;

    const payload = {
      longUrl: this.editData.longUrl,
      shortUrl: this.editData.shortUrl
    };

    this.urlService.updateUrl(this.editData.id, payload).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar("URL updated successfully!");
        this.closeEditModal();
        this.loadUrls();
      },
      error: (err) => {
        this.modalErrorMessage = err?.error?.message || 'An error occurred while updating the URL.';
        this.isUpdating = false;
      },
      complete: () => {
        this.isUpdating = false;
      }
    });
  }


  generateShortUrl(): void {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 5;
    const candidate = Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');

    this.editData.shortUrl = candidate;
  }

  deleteUrl(urlId: string): void {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    this.urlService.deleteUrl(urlId).subscribe({
      next: () => {
        this.showFlash('success', 'URL deleted successfully!');
        this.loadUrls();
      },
      error: (err) => {
        this.showFlash('danger', 'Failed to delete URL');
      }
    });
  }

  renewUrlVisit(urlId: string): void {
    this.router.navigate([`/user/url/${urlId}/renew-visits`]);
  }

  goBack(): void {
    if (this.isAdminMode) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  private showFlash(type: string, message: string): void {
    this.flash = { type, message };
    setTimeout(() => this.flash = { type: '', message: '' }, 3000);
  }
}