import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
   responseData: any;
  constructor(private http: HttpClient, private router: Router) { }

enableCalendly(data:any): Observable<any> {
    this.responseData = this.http.post<any>(
      `${apiUrlConfig.settings}/calendly/enable`,data
    );
    return this.responseData;
}

enableReferral(data:any): Observable<any> {
    this.responseData = this.http.post<any>(
      `${apiUrlConfig.settings}/referral/enable`,data
    );
    return this.responseData;
}

disableReferral(data:any): Observable<any> {
    this.responseData = this.http.put<any>(
      `${apiUrlConfig.settings}/referral/disable`,data
    );
    return this.responseData;
}

changeCalendlyAccount(data:any): Observable<any> {
    this.responseData = this.http.post<any>(
      `${apiUrlConfig.settings}/calendly/account/change`,data
    );
    return this.responseData;
}

disableCalendly(data:any): Observable<any> {
    this.responseData = this.http.put<any>(
      `${apiUrlConfig.settings}/calendly/disable`,data
    );
    return this.responseData;
  }

 get(): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiUrlConfig.settings}/getAll`,{}
    );
    return this.responseData;
  }



}
