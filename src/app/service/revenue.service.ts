import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private baseUrl = 'http://localhost:8001/api/v1/url-shortner/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getMonthwiseRevenue(year: number): Observable<any> {
    const params = new HttpParams()
      .set('value', 'total-revenue')
      .set('year', year.toString());

    return this.http.get<any>(
      `${this.baseUrl}/monthwise-records`,
      { headers: this.getAuthHeaders(), params }
    );
  }
}
