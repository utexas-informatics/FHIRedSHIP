import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';


@Injectable({
  providedIn: 'root'
})
export class ResponseService {
   responseData: any;
 constructor(private http: HttpClient, private router: Router) { }

saveResponse(forms:any): Observable<any> {
   this.responseData = this.http.post<any>(
      `${apiUrlConfig.response}/save`,forms
    );
    return this.responseData;
  }

updateResponse(forms:any): Observable<any> {
   this.responseData = this.http.put<any>(
      `${apiUrlConfig.response}/update`,forms
    );
    return this.responseData;
  }


getResponseById(responseId:any): Observable<any> {
   this.responseData = this.http.get<any>(
      `${apiUrlConfig.response}/${responseId}`
    );
    return this.responseData;
  }

  getRules(tempId:any): Observable<any> {
    this.responseData = this.http.get<any>(
       `${apiUrlConfig.rule}/${tempId}`
     );
     return this.responseData;
   }

getResponses(moduleId:any,page:any,limit:any): Observable<any> {
   this.responseData = this.http.get<any>(
      `${apiUrlConfig.response}?moduleId=${moduleId}&limit=${limit}&page=${page}`
    );
    return this.responseData;
  }

  




}
