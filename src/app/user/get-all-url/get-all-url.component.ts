import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlService } from 'src/app/service/url.service';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-get-all-url',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './get-all-url.component.html',
  styleUrls: ['./get-all-url.component.css']
})
export class GetAllUrlComponent implements OnInit {
  urls: any[] = [];
  loading = false;
  error: string | null = null;
  userId: string | null = null;

  constructor(
    private loginService: LoginService,
    private urlService: UrlService
  ) {}

  ngOnInit() {
    this.userId = this.loginService.getUserId();

    if (!this.userId) {
      this.error = 'User not authenticated. Please login.';
      return;
    }

    this.fetchUrls();
  }

  fetchUrls() {
    this.loading = true;
    this.error = null;
    const params = new HttpParams();

    this.urlService.viewAllUrlsByUserId(this.userId!, params).subscribe({
      next: (response) => {
        this.urls = response.body; 
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load URLs. Please try again.';
        this.loading = false;
      }
    });
  }
}