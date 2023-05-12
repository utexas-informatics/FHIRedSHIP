import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class FileuploadService {
  responseData: any;
  constructor(private http: HttpClient, private router: Router) {}

  get(params: any): Observable<any> {
    this.responseData = this.http.get<any>(
      `${apiUrlConfig.fileupload}?linking=${params}`
    );
    return this.responseData;
  }

  // saveData(linking:any,email:any,logo:any,file:any,path:any): Observable<any> {
  // const formData = new FormData();
  // formData.append(logo, file, path)

  // this.responseData = this.http.post<any>(
  //     `${apiUrlConfig.fileupload}?linking=${linking}&email=${email}`,formData
  //   );
  //   return this.responseData;
  // }

 remove(params: any,email:any,linking:any,file:any): Observable<any> {
    this.responseData = this.http.delete<any>(
      `${apiUrlConfig.fileupload}?id=${params}&email=${email}&linking=${linking}&file=${file}`
    );
    return this.responseData;
  }
}