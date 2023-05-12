import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  responseData: any;

  constructor(private http: HttpClient, private router: Router) { }

 saveNotes(data:any): Observable<any> {
   this.responseData = this.http.post<any>(
      `${apiUrlConfig.notes}/save`,data
    );
    return this.responseData;
  }

   updateNotes(data:any): Observable<any> {
   this.responseData = this.http.put<any>(
      `${apiUrlConfig.notes}/update`,data
    );
    return this.responseData;
  }
  clearNotes(id:any): Observable<any> {
   this.responseData = this.http.delete<any>(
      `${apiUrlConfig.notes}/remove/${id}`
    );
    return this.responseData;
  }
  get(refId:any,status:any): Observable<any> {
   this.responseData = this.http.get<any>(
      `${apiUrlConfig.notes}/get?module=${refId}&type=status&status=${status}`
    );
    return this.responseData;
  }

}
