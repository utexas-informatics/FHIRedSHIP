import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  public clearData: BehaviorSubject<string> = new BehaviorSubject('');
  isClearData: Observable<string>;

  responseData: any;
  constructor(private http: HttpClient, private router: Router) {
    this.isClearData = this.clearData.asObservable();
  }

  get(): Observable<any> {
    this.responseData = this.http.get<any>(
      environment.apiBaseUrl + '/assessment/'
    );
    return this.responseData;
  }

  share(data: any): Observable<any> {
    this.responseData = this.http.post<any>(
      environment.apiBaseUrl + '/share/',
      data
    );
    return this.responseData;
  }

  getSharedData(data: any): Observable<any> {
    this.responseData = this.http.post<any>(
      environment.apiBaseUrl + '/share/get',
      data
    );
    return this.responseData;
  }
}
