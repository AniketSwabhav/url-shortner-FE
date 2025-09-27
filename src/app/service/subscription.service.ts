import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subscription {
  freeShortUrls: number;
  freeVisits: number;
  newUrlPrice: number;
  extraVisitPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private token = localStorage.getItem('token') || '';
  private baseUrl = 'http://localhost:8001/api/v1/url-shortner/urls';

  constructor(private http: HttpClient) {}

  getSubscription(userId: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.baseUrl}/subscription`);
  }
 
  setSubscription(userId: string, payload: Subscription): Observable<any> {
    return this.http.post(`${this.baseUrl}/subscription`, payload);
  }

  updateSubscription(userId: string, payload: Subscription): Observable<any> {
    return this.http.put(`${this.baseUrl}/subscription/update`, payload);
  }
}
