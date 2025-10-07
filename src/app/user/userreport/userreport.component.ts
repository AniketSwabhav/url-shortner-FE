import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-userreport',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule],
  templateUrl: './userreport.component.html',
  styleUrls: ['./userreport.component.css']
})
export class UserreportComponent implements OnInit {
  userId: string | null = null;
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];

  labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  spendingChartData: ChartConfiguration<'bar'>['data'] = { labels: this.labels, datasets: [] };
  renewalsChartData: ChartConfiguration<'line'>['data'] = { labels: this.labels, datasets: [] };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Spending ($)'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Renewal Count'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.populateYearDropdown();

    if (this.userId) {
      this.loadChartData();
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  populateYearDropdown(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Last 10 years
  }

  onYearChange(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.userService.getUserReportStats(this.userId!, this.selectedYear).subscribe({
      next: (data) => this.prepareChartData(data),
      error: (err) => {
        this.snackbarService.showErrorSnackbar(err)
      }
    },
    );
  }

  prepareChartData(data: {
    Month: number;
    MonthlySpending: number;
    UrlsRenewed: number;
    VisitsRenewed: number;
  }[]): void {
    const monthlySpending = Array(12).fill(0);
    const urlsRenewed = Array(12).fill(0);
    const visitsRenewed = Array(12).fill(0);

    data.forEach(item => {
      const idx = item.Month - 1;
      if (idx >= 0 && idx < 12) {
        monthlySpending[idx] = item.MonthlySpending;
        urlsRenewed[idx] = item.UrlsRenewed;
        visitsRenewed[idx] = item.VisitsRenewed;
      }
    });

    this.spendingChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Monthly Spending',
          data: monthlySpending,
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }
      ]
    };

    this.renewalsChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'URLs Renewed',
          data: urlsRenewed,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Visits Renewed',
          data: visitsRenewed,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }
}
