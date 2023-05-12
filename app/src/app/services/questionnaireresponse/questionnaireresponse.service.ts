import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireresponseService {
  responseData: any;
  constructor(private http: HttpClient, private router: Router) { }

     getquestionnaireresponses(params:any): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiUrlConfig.questionnaireresponse}${params}`
    );
    return this.responseData;
  }
  
}
