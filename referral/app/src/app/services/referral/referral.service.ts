import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "./../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  responseData: any;
  constructor(private http: HttpClient, private router: Router) { }

    getReferral(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/referral/user/'+id
    );
    return this.responseData;
    } 

    checkForHtmlTag(text:any){
      if(text){
        text = text.replace( /(<([^>]+)>)/ig, '');
      }
      return text;
    }

    getRefById(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/referral/'+id
    );
    return this.responseData;
    } 

  
    save(object:any): Observable<any> {
    this.responseData = this.http.post<any>(
      environment.apiBaseUrl + `/referral`,object
    );
    return this.responseData;
   }

    update(object:any): Observable<any> {
    this.responseData = this.http.put<any>(
      environment.apiBaseUrl + `/referral`,object
    );
    return this.responseData;
   }

   updateStaus(id:any,object:any): Observable<any> {
    this.responseData = this.http.put<any>(
      environment.apiBaseUrl + `/referral/${id}`,object
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

}
