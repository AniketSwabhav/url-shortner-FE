import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueService } from 'src/app/service/revenue.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  revenueData: { [key: string]: number } = {};
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  year: number = new Date().getFullYear();
  availableYears: number[] = [];

  constructor(
    private revenueService: RevenueService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Generate last 5 years for selection
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Read year from URL if present
    this.route.queryParams.subscribe(params => {
      const urlYear = parseInt(params['year'], 10);
      if (urlYear && this.availableYears.includes(urlYear)) {
        this.year = urlYear;
      }
      this.loadRevenue();
    });
  }

  loadRevenue() {
    this.revenueService.getMonthwiseRevenue(this.year).subscribe({
      next: (res) => {
        this.revenueData = res;
      },
      error: (err) => console.error('Error fetching revenue', err)
    });
  }

  onYearChange() {
    // Update the URL with selected year
    this.router.navigate([], {
      queryParams: { year: this.year },
      queryParamsHandling: 'merge'
    });

    this.loadRevenue();
  }

  get totalRevenue(): number {
    return Object.values(this.revenueData).reduce((a, b) => a + b, 0);
  }
}
