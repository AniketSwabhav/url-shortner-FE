import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private URL = 'http://localhost:8001/api/v1/url-shortner/user/{userId}';

  constructor(private http: HttpClient) { }

}
