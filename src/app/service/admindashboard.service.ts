
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  isAdmin: boolean;
  isActive: boolean;
  urlCount: number;
  wallet: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdmindashboardService {
  private baseUrl = 'http://localhost:8001/api/v1/url-shortner/users';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllUsers(params?: HttpParams): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/`, { params: params, observe: 'response' as 'body' });
  }

  viewUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}`);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`, this.getAuthHeaders());
  }


}
