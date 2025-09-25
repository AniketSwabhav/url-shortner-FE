import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8001/api/v1/url-shortner/users';
  private roleKey = 'role';

  // Tracks authentication status
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  authStatus$ = this.authStatus.asObservable(); 

  constructor(
    private http: HttpClient, 
    private jwtHelper: JwtHelperService, 
    private router: Router,
  ) {}

  // Login API call
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Save token & update role
  setToken(token: string): void {
    localStorage.setItem('token', token);
    const decodedToken = this.jwtHelper.decodeToken(token);
    localStorage.setItem(this.roleKey, decodedToken?.IsAdmin ? 'admin' : 'user');
    this.authStatus.next(true);
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  // Check if user is admin
  isAdmin(): boolean {
    return localStorage.getItem(this.roleKey) === 'admin';
  }

  // Update auth status for components/guards
  updateAuthStatus(): void {
    this.authStatus.next(this.isAuthenticated());
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.roleKey);
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }
}
