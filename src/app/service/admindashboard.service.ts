import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  isAdmin: boolean;
  isActive: boolean;
  credential: {
    id: string;
    email: string;
    userId: string;
  };
  urlCount: number;
  wallet: number;
}

export interface UserResponse {
  users: User[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdmindashboardService {
  private baseUrl = 'http://localhost:8001/api/v1/url-shortner/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllUsers(params: HttpParams): Observable<User[]> {
  return this.http.get<User[]>(`${this.baseUrl}/`, {
    ...this.getAuthHeaders(),
    params,
  });
}

  // getUserById(userId: string): Observable<User> {
  //   return this.http.get<User>(`${this.baseUrl}/${userId}`, this.getAuthHeaders());
  // }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`, this.getAuthHeaders());
  }
}
