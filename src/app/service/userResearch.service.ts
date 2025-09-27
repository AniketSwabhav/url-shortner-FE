import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MonthlyStats {
  [month: string]: number; // e.g., "January": 5
}

@Injectable({
  providedIn: 'root'
})
export class UserResearchService {
  private baseUrl = 'http://localhost:8001/api/v1/url-shortner/users/';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
    });
  }

  // Generic method to fetch stats
  getStats(value: string, year: number): Observable<MonthlyStats> {
    const params = new HttpParams()
      .set('value', value)
      .set('year', year.toString());

    return this.http.get<MonthlyStats>(this.baseUrl, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  // Specific helper methods
  getNewUsers(year: number): Observable<MonthlyStats> {
    return this.getStats('new-users', year);
  }

  getActiveUsers(year: number): Observable<MonthlyStats> {
    return this.getStats('active-users', year);
  }

  getUrlsGenerated(year: number): Observable<MonthlyStats> {
    return this.getStats('urls-generated', year);
  }

  getUrlsRenewed(year: number): Observable<MonthlyStats> {
    return this.getStats('urls-renewed', year);
  }

  getTotalRevenue(year: number): Observable<MonthlyStats> {
    return this.getStats('total-revenue', year);
  }
}
