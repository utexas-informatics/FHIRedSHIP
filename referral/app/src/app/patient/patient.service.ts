import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  responseData: any;
  constructor(private http: HttpClient, private router: Router) { }

  get(): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + "/user/patient"
    );
    return this.responseData;
  }

  search(text:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + `/user/patient/email/${text}`
    );
    return this.responseData;
  }

  getAssesment(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/assessment/'+id
    );
    return this.responseData;
  }

  checkShared(data: any){
    this.responseData = this.http.post<any>(
      environment.apiBaseUrl + '/share/check',
      data
    );
    return this.responseData;
  }

  getAssesmentResponses(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/questionnaireresponse/patient/'+id
    );
    return this.responseData;
  }

  getAssesmentResponse(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/questionnaireresponse/'+id
    );
    return this.responseData;
  }

   getAssesmentForm(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/Questionnaire/'+id
    );
    return this.responseData;
  }

  getCondition(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/condition/questionnaireresponse/'+id
    );
    return this.responseData;
  }


  saveAssesmentResponse(data:any): Observable<any> {
    this.responseData = this.http.post<any>(
      environment.apiBaseUrl + '/questionnaireresponse/',
      data
    );
    return this.responseData;
  }

  updateResponse(data:any): Observable<any> {
    this.responseData = this.http.put<any>(
      environment.apiBaseUrl + '/questionnaireresponse/',
      data
    );
    return this.responseData;
  }

  searchCodes(text:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + `/code?search=`+text
    );
    return this.responseData;
  }

  saveCondition(data:any): Observable<any> {
    this.responseData = this.http.post<any>(
      environment.apiBaseUrl + '/condition/',
      data
    );
    return this.responseData;
  }

  
   getconditions(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/condition/questionnaireresponse/'+id
    );
    return this.responseData;
  }

  
   removeCondition(id:any): Observable<any> {
    this.responseData = this.http.delete<any>(
      environment.apiBaseUrl + '/condition/'+id
    );
    return this.responseData;
  }

}
