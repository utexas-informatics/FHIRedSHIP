import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, delay } from "rxjs/operators";
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { apiBaseUrl, apiUrlConfig } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public inMessage: BehaviorSubject<any> = new BehaviorSubject(false);
  inMessageListener: Observable<any>;

  constructor(private httpClient: HttpClient) {
    this.inMessageListener = this.inMessage.asObservable();
   }

  async getMessages(roomId: any,record:any,pageNum:any) {
    return await this.httpClient
      .get<any>(apiUrlConfig.messages+roomId+"?page="+pageNum+"&record="+record)
      .pipe()
      .toPromise();
  }
}
 