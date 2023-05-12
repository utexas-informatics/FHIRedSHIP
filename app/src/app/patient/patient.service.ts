import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
//import { environment } from "../../environments/environment";
import { apiBaseUrl, apiUrlConfig } from "../constants";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  responseData: any;
  constructor(private http: HttpClient, private router: Router) {}

  get(organization: any,params:any): Observable<any> {
    let url = `${apiUrlConfig.patients}?organization=` + organization+`&${params}`;
    this.responseData = this.http.get<any>(url);
    return this.responseData;
  }
 
   getAssesmentResponses(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiUrlConfig.patients}/${id}/assessments`
    );
    return this.responseData;
  }

   getAssesmentForm(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiUrlConfig.assessments}/${id}`
    );
    return this.responseData;
  }

  getAssesmentResponse(id:any): Observable<any> {
     this.responseData = this.http.get<any>(
      `${apiUrlConfig.patients}/questionnaireresponse/${id}`
    );
    return this.responseData;
  }

  /*
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

 

  getAssesmentResponse(id:any): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/questionnaireresponse/'+id
    );
    return this.responseData;
  }

  saveAssesmentResponse(data:any): Observable<any> {
    this.responseData = this.http.post<any>(
      environment.apiBaseUrl + '/questionnaireresponse/',
      data
    );
    return this.responseData;
  }*/
}
