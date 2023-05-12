import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';


@Injectable({
  providedIn: 'root'
})
export class FormsService {
   responseData: any;
 constructor(private http: HttpClient, private router: Router) { }

getFormById(formId:any): Observable<any> {
   this.responseData = this.http.get<any>(
      `${apiUrlConfig.templates}/${formId}`
    );
    return this.responseData;
  }



}
