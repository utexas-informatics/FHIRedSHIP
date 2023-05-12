import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  responseData: any;

  constructor(private http: HttpClient, private router: Router) { }

  share(data:any): Observable<any> {
   this.responseData = this.http.post<any>(
      `${apiUrlConfig.share}`,data
    );
    return this.responseData;
  }


}
