import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  responseData: any;
  constructor(private httpClient: HttpClient, private router: Router) { }
 
  async getEvents(org: any,email:any,token:any) {
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'skip':'true',
      'cred':'none'
    })
    return await this.httpClient
      .get<any>(`https://api.calendly.com/scheduled_events?organization=${org}&invitee_email=${email}`,{'headers':headers})
      .pipe()
      .toPromise();
  }
  cancelAppt(appointment:any): Observable<any>{
    // const headers =  new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${token}`,
    //   'skip':'true',
    //   'cred':'none'
    // })
    // return await this.httpClient
    //   .post<any>(`https://api.calendly.com/scheduled_events/${uuid}/cancellation`,{},{'headers':headers})
    //   .pipe()
    //   .toPromise();
  
  this.responseData = this.httpClient.put<any>(
      `${apiUrlConfig.appointment}/cancel`,appointment
    );
    return this.responseData;

  }
 
  getAppointment(id:any,page:any,limit:any): Observable<any> {
    this.responseData = this.httpClient.get<any>(
      `${apiUrlConfig.appointment}?moduleId=${id}&page=${page}&limit=${limit}`,
    );
    return this.responseData;
  }
}
