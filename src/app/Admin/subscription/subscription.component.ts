import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubscriptionService, Subscription } from 'src/app/service/subscription.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  subscriptionForm!: FormGroup;
  subscription: Subscription | null = null;
  private userId = localStorage.getItem('userId') || '';

  constructor(private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.subscriptionForm = this.fb.group({
  freeShortUrls: ['', [Validators.required, Validators.min(1), Validators.max(1000000)]],
  freeVisits: ['', [Validators.required, Validators.min(1), Validators.max(1000000)]],
  newUrlPrice: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
  extraVisitPrice: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
});


    this.loadSubscription();
  }

  loadSubscription(): void {
    this.subscriptionService.getSubscription(this.userId).subscribe({
      next: (res) => {
        this.subscription = res;
        if (res) {
          this.subscriptionForm.patchValue(res);
        }
        console.log('Subscription loaded', res);
      },
      error: (err) => {
        console.error('Error loading subscription', err);
        this.subscription = null;
        // this.snackbarService.showErrorSnackbar(err.error?.message || 'Failed to load subscription');
      }
    });
  }

  setPrice(): void {
    if (this.subscriptionForm.invalid) {
      alert('Please fill valid values in the form.');
      return;
    }

    const payload = this.subscriptionForm.value;
    this.subscriptionService.setSubscription(this.userId, payload).subscribe({
      next: (res) => {
        console.log('Set successfully', res);
        alert('Subscription set successfully');
        this.loadSubscription();
      },
      error: (err) => {
        console.error('Error setting subscription', err);
        alert(err.error?.message || 'Failed to set subscription');
      }
    });
  }

  updatePrice(): void {
    if (this.subscriptionForm.invalid) {
      alert('Please fill valid values in the form.');
      return;
    }

    const payload = this.subscriptionForm.value;
    this.subscriptionService.updateSubscription(this.userId, payload).subscribe({
      next: (res) => {
        console.log('Updated successfully', res);
        alert('Subscription updated successfully');
        this.loadSubscription();
      },
      error: (err) => {
        console.error('Error updating subscription', err);
        alert(err.error?.message || 'Failed to update subscription');
      }
    });
  }

  preventDecimal(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',' || event.key === 'e') {
      event.preventDefault();
    }
  }
}
