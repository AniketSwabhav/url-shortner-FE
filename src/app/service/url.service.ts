import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private URL = 'http://localhost:8001/api/v1/url-shortner/url';

  constructor(private http: HttpClient) { }

  viewAllUrlsByUserId(userId: string, params?: HttpParams): Observable<any> {
    return this.http.get<any[]>(`${this.URL}/user/${userId}`,{ params: params, observe: "response" });
  }

  addUrl(longUrl: string): Observable<any> {
    const payload = { longUrl };
    return this.http.post<any>(`${this.URL}/register`, payload );
  }

  createShortUrl(payload: { longUrl: string, shortUrl: string }) {
    return this.http.post<any>(`${this.URL}/register`, payload);
  }

  renewVisits(urlId: string, visits: number) {
    return this.http.post(`${this.URL}/${urlId}/renew-visits`, { visits });
  }

  updateUserById(urlId : string ,urlData:any): Observable<any> {
    return this.http.put<any>(`${this.URL}/${urlId}`,urlData)
  }
  
  deleteUrl(urlId:string ):Observable<any>{
    return this.http.delete(`${this.URL}/${urlId}`)
  }

  getUrlFromAlias(alias: string, params?: HttpParams): Observable<any> {
    return this.http.get(`http://localhost:8001/api/v1/url-shortner/redirect/${alias}`,
      { params: params, observe: "response" })
  }

}
