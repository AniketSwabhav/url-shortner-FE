import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserReportService {

  private baseURL = 'http://localhost:8001/api/v1/url-shortner/users';

  constructor(private http: HttpClient) {}

  getUserReportStats(urlId:string,year: number) {
    return this.http.get<{
      Month: number;
      MonthlySpending: number;
      UrlsRenewed: number;
      VisitsRenewed: number;
    }[]>(`${this.baseURL}/${urlId}/report?year=${year}`);
  }

  getYearlyStats(urlId:string,value: string, year: number) {
    return this.http.get<{ month: number, value: number }[]>(
      `${this.baseURL}/${urlId}/report?value=${value}&year=${year}`
    );
  }
}
