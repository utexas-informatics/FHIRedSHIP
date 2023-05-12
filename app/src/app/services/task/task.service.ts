import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  responseData: any;
  constructor(private http: HttpClient, private router: Router) { }
 
  // getTasks(userId:any,moduleId:any,data:any): Observable<any> {
  //   this.responseData = this.http.post<any>(
  //     `${apiUrlConfig.task}/${userId}?moduleId=${moduleId}`,data
  //   );
  //   return this.responseData;
  // }

  getTasks(userId:any,params:any): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiUrlConfig.task}/${userId}?${params}`
    );
    return this.responseData;
  }

  update(id:any,data:any): Observable<any> {
    this.responseData = this.http.put<any>(
      `${apiUrlConfig.task}/${id}`,data
    );
    return this.responseData;
  }

  save(data:any): Observable<any> {
    this.responseData = this.http.post<any>(
      `${apiUrlConfig.task}`,data
    );
    return this.responseData;
  }
}
 