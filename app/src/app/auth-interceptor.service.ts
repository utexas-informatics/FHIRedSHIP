/*import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';*/
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LocalstoreService } from './shared/service/localstore/localstore.service';

declare var $: any;

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  user:string='';
  constructor(

    private localstoreService: LocalstoreService,

  ) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return from(this.handle(req, next));
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    let authorization;
    let patientId;
    let researcherId;
    let userRole:any = await this.localstoreService.getRec('role');
    let urole ='';
    if(userRole && userRole.role){
      urole=userRole.role;
    }
    if (!req.headers.get('skip')) {
   /*   if (sessionStorage.getItem('userRole') == 'researcher') {
        const token = atob(sessionStorage.getItem('at_id'));
        authorization = token ? { Authorization: `bearer ${token}` } : '';
        researcherId = sessionStorage.getItem('researcherId');
        userRole = 'researcher';
      } else {
        const token = sessionStorage.getItem('patientToken');
        authorization = token ? { Authorization: `bearer ${token}` } : '';
        patientId = sessionStorage.getItem('patientId');
        userRole = 'patient';
      }*/
    let token = await this.localstoreService.getRec('access_token');
    let session_state = await this.localstoreService.getRec('session_state');
    this.user = await this.localstoreService.getRec('_id');
    let patientId='';
    let researcherId='';
    let authorization:any = token ? { Authorization: `bearer ${token}` } : '';



      //this.localstoreService.getIsMobile() == true?authorization.Authorization:''
      
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          patientId: patientId ? patientId : '',
          researcherId: researcherId ? researcherId : '',
          userId:this.user?this.user:'',
          userRole: urole,
          source: 'fsApp',
          platform: 'web',
          Authorization:authorization.Authorization?authorization.Authorization:'',
          session_state: session_state ? session_state : '',
        },
        withCredentials: true
      });
    } else {
      if(!req.headers.get('cred')) {
        req = req.clone({
          setHeaders: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            userId:this.user?this.user:'',
            patientId: patientId ? patientId : '',
            researcherId: researcherId ? researcherId : '',
            userRole: urole,
            source: 'fsApp',
            platform: 'web',
          },
          withCredentials: true
        });
      }
    
    }

    return next.handle(req).toPromise();
  }
}