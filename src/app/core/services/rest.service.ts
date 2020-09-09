import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AppService } from './app.service';

@Injectable()
export class RestService {
  constructor(private httpClient: HttpClient, private appService: AppService) {}

  get(url, options: any = {}): Observable<any> {
    const headers: HttpHeaders = options.headers || new HttpHeaders();
    return this.httpClient.get(url, { headers });
  }

  post(url: string, body: any | null, options: any = {}) {
    const headers: HttpHeaders = options.headers || new HttpHeaders();
    return this.httpClient.post(url, body, { headers });
  }

  put(url: string, body: any | null, options: any = {}) {
    const headers: HttpHeaders = options.headers || new HttpHeaders();
    return this.httpClient.put(url, body, { headers });
  }

  delete(url: string, options: any = {}) {
    const headers: HttpHeaders = options.headers || new HttpHeaders();
    return this.httpClient.delete(url, { headers });
  }
}
