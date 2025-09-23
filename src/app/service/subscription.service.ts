import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private URL = 'http://localhost:8001/api/v1/url-shortner/user';

  constructor(private http: HttpClient) { }
}
