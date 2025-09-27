import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/service/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  years: number[] = [];
  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  valueTypes = [
    { value: 'new-users', display: 'New Users' },
    { value: 'active-users', display: 'Active Users' },
    { value: 'urls-generated', display: 'URLs Generated' },
    { value: 'urls-renewed', display: 'URLs Renewed' },
    { value: 'total-revenue', display: 'Total Revenue' },
  ];

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1; // JS months are 0-indexed
  selectedValueType: string = 'total-revenue';

  result: { month: string, value: number } | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Populate last 10 years for dropdown
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }

  fetchStats(): void {
    this.userService.getMonthwiseRecords(this.selectedValueType, this.selectedYear, this.selectedMonth)
      .subscribe({
        next: (data) => {
          this.result = data;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.result = null;
        }
      });
  }
}
