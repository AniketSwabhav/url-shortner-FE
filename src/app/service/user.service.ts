import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userURL = 'http://localhost:8001/api/v1/url-shortner/users';

    constructor(private http: HttpClient) { }

    viewAllUsers(params?: HttpParams): Observable<any> {
        return this.http.get<any[]>(`${this.userURL}/`,{ params: params, observe: "response" });
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
        return this.http.get<any>(`${this.userURL}/${id}`);
    }

    getTransactions(userId: string, params?: HttpParams): Observable<any> {
        return this.http.get<any[]>(`${this.userURL}/${userId}/transactions`,{params: params, observe: "response" });
    }

    fetchWalletAmount(userId: string): Observable<number> {
        return this.http.get<number>(`${this.userURL}/${userId}/amount`,);
    }


    addAmount(userId: string, amount: number): Observable<any> {
        return this.http.post(`${this.userURL}/${userId}/wallet/add`,{ wallet: amount },);
    }

    withdrawAmount(userId: string, amount: number): Observable<any> {
        return this.http.post(`${this.userURL}/${userId}/wallet/withdraw`,{ wallet: amount },);
    }

    renewUrls(userId: string, count: number): Observable<any> {
        const body = { urlCount: count };
        return this.http.post<any>(`${this.userURL}/${userId}/renew-urls`,body);
    }

}