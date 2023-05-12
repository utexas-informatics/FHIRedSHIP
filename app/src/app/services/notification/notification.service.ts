import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { apiBaseUrl, apiUrlConfig } from '../../constants';
import { LocalstoreService } from '../../shared/service/localstore/localstore.service';
 
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public notUpdate: BehaviorSubject<any> = new BehaviorSubject(false);
  notUpdateListener: Observable<any>;
  constructor(private socket: Socket, private httpClient:HttpClient,private localstoreService:LocalstoreService) {
    this.notUpdateListener = this.notUpdate.asObservable();
  }
 
  sendMessage(evt: string, data: any,user:any) {
     let token = this.localstoreService.getRec("access_token");

     // this.socket['authToken'] = userData.access_token;
    this.socket.emit(evt, data,user,token);
  }
 
  onNotification() {
    return this.socket.fromEvent('notification');
  }

  unAuthorised() {
    return this.socket.fromEvent('unAuthorised');
  }

  onConnection() {
    return this.socket.fromEvent('connect');
  }

  onDisconnect() {
    return this.socket.fromEvent('disconnect');
  }

  onOpen() {
    return this.socket.fromEvent('open');
  }

  createRoom() {
    return this.socket.fromEvent('createRoom');
  }

  addMessage() {
    return this.socket.fromEvent('addMessage');
  }
  socketConnected(){
    return this.socket.fromEvent('socketConnected');
  }
  getNotification(qparams:any): Observable<any>{
     return this.httpClient.get(`${apiUrlConfig.notification}${qparams}`,{});
  }

  async getNotificationById(id: any,limit:any,page:any) {
    return await this.httpClient
      .get<any>(`${apiUrlConfig.notification}/${id}?limit=${limit}&page=${page}`)
      .pipe()
      .toPromise();
  }

  async getNotificationByroomId(roomId: any,receiverId:any) {
    return await this.httpClient
      .get<any>(`${apiUrlConfig.notification}/room/${roomId}?receiverId=${receiverId}`)
      .pipe()
      .toPromise();
  }
  

  async update(id:any,data:any,role:any){
    return await this.httpClient
    .put<any>(`${apiUrlConfig.notification}/${id}?role=${role}`,data)
    .pipe()
    .toPromise();
  }

  async updateAll(id:any,data:any){
    return await this.httpClient
    .put<any>(`${apiUrlConfig.notification}/updateAll/${id}`,data)
    .pipe()
    .toPromise();
  }
}
