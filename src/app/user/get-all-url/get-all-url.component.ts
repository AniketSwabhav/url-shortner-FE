import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlService } from 'src/app/service/url.service';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { LoginService } from 'src/app/service/login.service';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-get-all-url',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './get-all-url.component.html',
  styleUrls: ['./get-all-url.component.css']
})
export class GetAllUrlComponent implements OnInit {
  urls: any[] = [];


  constructor(
    private urlService: UrlService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.fetchUrls();
  }

  fetchUrls() {
    const params = new HttpParams();
    this.urlService.viewAllUrlsByUserId(params).subscribe({
      next: (response) => {
        this.urls = response.body;
      },
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err)
      }
    });
  }
}