import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:8001/api/v1/url-shortner/users';

  constructor(private http: HttpClient) { }


  
registerUser(payload: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register-user`, payload);
}

    registerAdmin(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register-admin`, payload);
  }

}
