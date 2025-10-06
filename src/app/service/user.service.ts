import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userURL = 'http://localhost:8001/api/v1/url-shortner/users';

    getReportStats(year: number) {
        return this.http.get<{
            Month: number;
            NewUsers: number;
            ActiveUsers: number;
            UrlsGenerated: number;
            UrlsRenewed: number;
            TotalRevenue: number;
            PaidUser: number;
        }[]>(`http://localhost:8001/api/v1/url-shortner/users/report?year=${year}`);
    }


    constructor(private http: HttpClient) { }

    viewAllUsers(params?: HttpParams): Observable<any> {
        return this.http.get<any[]>(`${this.userURL}/`, { params: params, observe: "response" });
    }

    updateUser(userId: string, userData: any): Observable<any> {
        return this.http.put<any>(`${this.userURL}/${userId}`, userData);
    }

    deleteUser(userId: string): Observable<any> {
        return this.http.delete<any>(`${this.userURL}/${userId}`);
    }

    viewUser(id: string) {
        return this.http.get<any>(`${this.userURL}/${id}`);
    }

    getTransactions(userId: string, params?: HttpParams): Observable<any> {
        return this.http.get<any[]>(`${this.userURL}/${userId}/transactions`, { params: params, observe: "response" });
    }

    fetchWalletAmount(userId: string): Observable<number> {
        return this.http.get<number>(`${this.userURL}/${userId}/amount`,);
    }


    addAmount(userId: string, amount: number): Observable<any> {
        return this.http.post(`${this.userURL}/${userId}/wallet/add`, { wallet: amount },);
    }

    withdrawAmount(userId: string, amount: number): Observable<any> {
        return this.http.post(`${this.userURL}/${userId}/wallet/withdraw`, { wallet: amount },);
    }

    renewUrls(userId: string, count: number): Observable<any> {
        const body = { urlCount: count };
        return this.http.post<any>(`${this.userURL}/${userId}/renew-urls`, body);
    }

    getMonthwiseRecords(value: string, year: number, month: number): Observable<{ month: string, value: number }> {
        const params = new HttpParams()
            .set('value', value)
            .set('year', year.toString())
            .set('month', month.toString());

        return this.http.get<{ month: string, value: number }>(
            `${this.userURL}/monthwise-records`,
            { params }
        );
    }

    getYearlyStats(value: string, year: number) {
        return this.http.get<{ month: number, value: number }[]>(
            `${this.userURL}/report?value=${value}&year=${year}`
        );
    }



}