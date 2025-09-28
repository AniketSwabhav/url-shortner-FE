import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UrlService } from 'src/app/service/url.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-url',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-url.component.html',
  styleUrls: ['./add-url.component.css']
})
export class AddUrlComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private urlService: UrlService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    this.form = this.fb.group({
      longUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      shortUrl: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5),
          Validators.pattern('^[a-zA-Z0-9]{5}$')
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.generateShortUrl();
  }

  generateShortUrl(): void {
    const candidate = this.randomString(5);
    this.form.patchValue({ shortUrl: candidate });
  }

  randomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  onGenerateAgainClick(): void {
    this.generateShortUrl();
  }

  clearLongUrl(): void {
    this.form.patchValue({ longUrl: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.snackbarService.showErrorSnackbar('Please provide valid input.');
      return;
    }

    const payload = {
      longUrl: this.form.value.longUrl,
      shortUrl: this.form.value.shortUrl
    };

    this.urlService.createShortUrl(payload).subscribe({
      next: () => {
        this.snackbarService.showSuccessSnackbar('Short URL created successfully!');
        this.router.navigate(['/user/urls']);
      },
      error: (err) => {
        const msg = err?.error || 'Error creating URL';
        this.snackbarService.showErrorSnackbar(msg);
      }
    });
  }
}
