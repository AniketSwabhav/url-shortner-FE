import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { UserService } from 'src/app/service/user.service';
import { UrlService } from 'src/app/service/url.service';

@Component({
  selector: 'app-redirect-url',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redirect-url.component.html',
  styleUrls: ['./redirect-url.component.css']
})
export class RedirectUrlComponent implements OnInit{

  constructor(
    private activatedRoute: ActivatedRoute,
    private urlService: UrlService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {
    this.initialiseVariables()
  }

  alias!: string
  initialiseVariables() {
    const params = this.activatedRoute.snapshot.params
    this.alias = params['shorturl']

    console.log(this.alias);
    
  }

   ngOnInit(): void {
    this.invalidAlias = false
    this.getUrlFromAlias()
  }

   invalidAlias: boolean = false

   getUrlFromAlias() {
    if (!this.alias) {
      return
    }
    this.urlService.getUrlFromAlias(this.alias).subscribe({
      next: (response) => {
        console.log("response", response);
        if (response.body.longUrl) {
          this.redirectToURL(response.body.longUrl)
          this.invalidAlias = false
        }
      }, error: (err) => {
        console.error(err);
        // this.snackbarService.showErrorSnackbar(err)
        this.invalidAlias = true
      }
    })
  }

  // www.google.com
  // http://www.google.com

   redirectToURL(url: any) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      window.location.href = 'http://' + url;
    } else {
      window.location.href = url;
    }
  }
}
