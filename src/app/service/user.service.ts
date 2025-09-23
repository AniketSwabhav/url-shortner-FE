import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private URL = 'http://localhost:8001/api/v1/url-shortner/user';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });
    }

    viewAllUsers(params?: HttpParams): Observable<any> {
        return this.http.get<any[]>(`${this.URL}/`,
            { headers: this.getAuthHeaders(), params: params, observe: "response" });
    }

    viewUser(id: string) {
        const url = `${this.URL}/${id}`;
        const headers = this.getAuthHeaders();
        return this.http.get<any>(url, { headers });
    }

}