import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userURL = 'http://localhost:8001/api/v1/url-shortner/users';

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });
    }

    viewAllUsers(params?: HttpParams): Observable<any> {
        return this.http.get<any[]>(`${this.userURL}/`,
            { headers: this.getAuthHeaders(), params: params, observe: "response" });
    }

    updateUser(userId: string, userData: any): Observable<any> {
        const url = `${this.userURL}/${userId}`;
        const headers = this.getAuthHeaders();
        return this.http.put<any>(url, userData, { headers });
    }

    deleteUser(userId: string): Observable<any> {
        const url = `${this.userURL}/${userId}`;
        const headers = this.getAuthHeaders();
        return this.http.delete<any>(url, { headers });
    }

    viewUser(id: string) {
        const url = `${this.userURL}/${id}`;
        const headers = this.getAuthHeaders();
        return this.http.get<any>(url, { headers });
    }

    getTransactions(userId: string, params?: HttpParams): Observable<any> {
        return this.http.get<any[]>(`${this.userURL}/${userId}/transactions`,
            { headers: this.getAuthHeaders(), params: params, observe: "response" });
    }

    fetchWalletAmount(userId: string): Observable<number> {
        return this.http.get<number>(
            `${this.userURL}/${userId}/amount`,
            { headers: this.getAuthHeaders() }
        );
    }


    addAmount(userId: string, amount: number): Observable<any> {
        return this.http.post(
            `${this.userURL}/${userId}/wallet/add`,
            { wallet: amount },
            { headers: this.getAuthHeaders() }
        );
    }

    withdrawAmount(userId: string, amount: number): Observable<any> {
        return this.http.post(
            `${this.userURL}/${userId}/wallet/withdraw`,
            { wallet: amount },
            { headers: this.getAuthHeaders() }
        );
    }

    renewUrls(userId: string, count: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token || ''}`
        });
        const body = { urlCount: count };
        return this.http.post<any>(`${this.userURL}/${userId}/renew-urls`,
            body,
            { headers }
        );
    }

   


}