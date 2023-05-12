import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LocalStore } from '../../shared/service/localstore/localstore.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  user:string='';
  constructor(

    private localStore: LocalStore,

  ) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return from(this.handle(req, next));
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    let authorization;
    let patientId;
    let researcherId;
    let userRole;
    let localData:any;
     localData = await this.localStore.get('ref-auth');
    if(localData){
    localData = JSON.parse(localData)
     let authorization:any = localData.token ? { Authorization: `bearer ${localData.token}` } : '';
     let userRole:any = localData.role?localData.role:"";
     let userid:any = localData._id?localData._id:"";
      
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization:authorization.Authorization?authorization.Authorization:'',
          userrole:userRole,
          userid:userid
        },
        withCredentials: true
      });
     }
    else{
      localData = {};
    }
    return next.handle(req).toPromise();
  }
}