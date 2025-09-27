import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResearchService } from 'src/app/service/userResearch.service';
import { Observable } from 'rxjs';

interface MonthlyStats {
  [month: string]: number;
}

@Component({
  selector: 'app-user-research',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-research.component.html',
  styleUrls: ['./user-research.component.css']
})
export class UserResearchComponent implements OnInit {

  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  statsData: MonthlyStats = {};
  valueType: string = 'new-users';
  year: number = new Date().getFullYear();
  availableYears: number[] = [];
  valueTypes = [
    { label: 'New Users', value: 'new-users' },
    { label: 'Active Users', value: 'active-users' },
    { label: 'Urls Generated', value: 'urls-generated' },
    { label: 'Urls Renewed', value: 'urls-renewed' },
  ];

  constructor(
    private userResearchService: UserResearchService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

    this.route.queryParams.subscribe(params => {
      this.valueType = params['value'] || this.valueType;
      this.year = +params['year'] || this.year;
      this.loadStats();
    });
  }

  loadStats() {
    let observable: Observable<MonthlyStats>;

    switch (this.valueType) {
      case 'new-users':
        observable = this.userResearchService.getNewUsers(this.year);
        break;
      case 'active-users':
        observable = this.userResearchService.getActiveUsers(this.year);
        break;
      case 'urls-generated':
        observable = this.userResearchService.getUrlsGenerated(this.year);
        break;
      case 'urls-renewed':
        observable = this.userResearchService.getUrlsRenewed(this.year);
        break;
      default:
        console.error('Invalid valueType:', this.valueType);
        return;
    }

    observable.subscribe({
      next: (res: MonthlyStats) => {
        this.statsData = {};
        for (const month of this.monthNames) {
          this.statsData[month] = res[month] || 0;
        }
      },
      error: (err) => console.error('Error fetching stats', err)
    });
  }

  onTypeChange() {
    this.updateUrl();
    this.loadStats();
  }

  onYearChange() {
    this.updateUrl();
    this.loadStats();
  }

  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { value: this.valueType, year: this.year },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  get total(): number {
    return Object.values(this.statsData).reduce((a, b) => a + b, 0);
  }
}
