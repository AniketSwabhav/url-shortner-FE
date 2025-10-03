import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();
  labels: string[] = [];

  // Chart data variables
  newUsersData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  activeUsersData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  totalRevenueData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  urlsLineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  // Chart options
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.generateLabels();
    this.loadReportData();
  }

  generateLabels(): void {
    this.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  loadReportData(): void {
    this.userService.getReportStats(this.selectedYear).subscribe({
      next: (arr) => this.updateCharts(arr),
      error: (err) => console.error('Error fetching report stats', err)
    });
  }

  updateCharts(data: {
    Month: number;
    NewUsers: number;
    ActiveUsers: number;
    UrlsGenerated: number;
    UrlsRenewed: number;
    TotalRevenue: number;
  }[]): void {
    const len = 12;
    const newUsers = Array(len).fill(0);
    const activeUsers = Array(len).fill(0);
    const urlsGenerated = Array(len).fill(0);
    const urlsRenewed = Array(len).fill(0);
    const totalRevenue = Array(len).fill(0);

    data.forEach(o => {
      const idx = o.Month - 1;
      if (idx >= 0 && idx < len) {
        newUsers[idx] = o.NewUsers;
        activeUsers[idx] = o.ActiveUsers;
        urlsGenerated[idx] = o.UrlsGenerated;
        urlsRenewed[idx] = o.UrlsRenewed;
        totalRevenue[idx] = o.TotalRevenue;
      }
    });

    this.newUsersData = {
      labels: this.labels,
      datasets: [{
        label: 'New Users',
        data: newUsers,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    this.activeUsersData = {
      labels: this.labels,
      datasets: [{
        label: 'Active Users',
        data: activeUsers,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };

    this.totalRevenueData = {
      labels: this.labels,
      datasets: [{
        label: 'Total Revenue',
        data: totalRevenue,
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }]
    };

    this.urlsLineChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'URLs Generated',
          data: urlsGenerated,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'URLs Renewed',
          data: urlsRenewed,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  }

  getLastYears(): number[] {
    const current = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => current - i);
  }
}
