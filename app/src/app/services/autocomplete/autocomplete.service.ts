import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
   responseData: any;
  constructor(private http: HttpClient, private router: Router) { }

get(url:any): Observable<any> {
    this.responseData = this.http.get<any>(
      `${url}`,
    );
    return this.responseData;
}
}
