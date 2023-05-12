import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  responseData: any;
  constructor(private http: HttpClient, private router: Router) { }

 getReferrals(params:any): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiUrlConfig.referral}${params}`
    );
    return this.responseData;
  }

  getReferral(params:any): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiUrlConfig.referral}/${params}`
    );
    return this.responseData;
  }
  statusUpdate(refId:any,data:any): Observable<any> {
    this.responseData = this.http.put<any>(
      `${apiUrlConfig.referral}/status/${refId}`,data
    );
    return this.responseData;
  }
  nextStep(data:any): Observable<any> {
    this.responseData = this.http.post<any>(
      `${apiUrlConfig.referral}/nextstep/notify`,data
    );
    return this.responseData;
  }


   /* getReferral(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/referral/user/'+id
    );
    return this.responseData;
  }

    save(object:any): Observable<any> {
    this.responseData = this.http.post<any>(
      environment.apiBaseUrl + `/referral`,object
    );
    return this.responseData;
  }

    searchPatient(text:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + `/user/patient/search/${text}`
    );
    return this.responseData;
  }

    searchCbo(text:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + `/user/cbo/search/${text}`
    );
    return this.responseData;
  }
*/
}
