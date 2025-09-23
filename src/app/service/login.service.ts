import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl='http://localhost:8001/api/v1/url-shortner/user';
  private roleKey = 'role';

  constructor(
    private http: HttpClient, 
    private jwtHelper: JwtHelperService, 
    private router: Router,
    ) {}

  login(data :any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  authStatus$ = this.authStatus.asObservable(); 

  updateAuthStatus() {
    this.authStatus.next(this.isAuthenticated());
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    const decodedToken = this.jwtHelper.decodeToken(token);
    localStorage.setItem(this.roleKey, decodedToken?.IsAdmin ? 'admin' : 'user');

    this.authStatus.next(true);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token || '');
  }

  getRole(): 'admin' | 'user' | null {
    return localStorage.getItem(this.roleKey) as 'admin' | 'user' | null;
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.IsAdmin === true || decodedToken?.IsAdmin === '1';
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/login']);
    this.authStatus.next(false);
  }

}
