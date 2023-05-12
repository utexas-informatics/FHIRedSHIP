import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  responseData: any;
  constructor(private http: HttpClient, private router: Router) {}

  getActivity(query:any): Observable<any>{
     return this.http.get(`${apiUrlConfig.activity}${query}`,{});
  }
}