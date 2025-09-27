import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlService } from 'src/app/service/url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


declare var bootstrap: any; // For Bootstrap modal usage

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private loginService: LoginService,
    private ngbModal: NgbModal
  ) { }


  @ViewChild('renewUrlModal') renewUrlModal: any

  ngOnInit() {
    this.userId = this.loginService.getUserId();
    this.fetchUrls();
    this.getProfile();

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

  fetchUrls() {
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
        console.log("err=> ", err)
        if (errorMsg.includes('maximum url creation limit')) {
          this.openRenewModal();
        } else {
          this.snackbarService.showErrorSnackbar(errorMsg);
        }
      }
    });
  }

  modelRef: any
  openRenewModal(): void {
    let option: NgbModalOptions = {
      size: 'sm'
    }
    this.modelRef = this.ngbModal.open(this.renewUrlModal, option)
  }

  redirectRenewUrls() {
    this.router.navigate(['user/urls/renew']);
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber - 1;
    this.offset = (pageNumber - 1);
    this.fetchUrls();
  }
}
