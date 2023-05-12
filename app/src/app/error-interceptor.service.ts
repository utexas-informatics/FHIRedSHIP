
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MsgService } from './services/msg/msg.service';

import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptorService implements HttpInterceptor {
  loginScreen:Boolean=false;
  constructor(private messageService: MsgService,
    private userService: UserService,
    private router: Router
  ) {}

   intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {
        if(error.error && error.error.msg && error.error.msg.includes("access")){
         this.userService.logOutUser(false,false);
         this.messageService.show('',error.error.msg,'danger','4000');
       }
   
        return this.handleError(error);
      })
    );
  }
  
  handleError(error:any) {
    let errorMsg = '';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
        this.messageService.show('',errorMsg,'danger','4000');
    } else {
      errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
      if (error.status === 400) {
        const message =
          error.error.error && error.error.error.details
            ? this.getMessageFromValidationError(error.error.error.details)
            : error.message;
     
         errorMsg = `Error: ${error.error.message}`;
        this.messageService.show('',errorMsg,'danger','4000');
      } else if (
        error.error &&
        error.error.status === 500 &&
        error.error.message.includes('User not found')
      ) {
        let msg=`${error.error.message}`;
        this.messageService.show('',msg,'danger','4000');
      } else if (error.status == '401' || error.status == 401) {
        if(error.error.message.includes('Unauthorized login user') || error.error.message.includes('Invalid Email or Password')){
          let msg=`${error.error.message}`;
        this.messageService.show('',msg,'danger','4000');
        }else{
          this.messageService.show('',this.messageService.msgObject.sessionExp,'danger','4000');
          this.userService.logOutUser(false,true);
        }  
        
      } else if (error.status == '403' || error.status == 403) {
        if(this.router.routerState.snapshot.url !== '/' && this.router.routerState.snapshot.url.split(';')[0] !=='/login'){
          this.messageService.show('',this.messageService.msgObject.accessDenied,'danger','4000');
          //this.router.navigate(['user']);

          if(error.error && error.error.msg && error.error.msg.includes("Token Mismatched")){
           this.userService.logOutUser(false,false);
          }
        }
        
      } else {
         let msg=`Something went wrong!!`;
         this.messageService.show('',msg,'danger','4000');
         //this.userService.logOutUser(false,false);
      }
    }
    return throwError(errorMsg);
  }
  getMessageFromValidationError({ headers, params, body, query }:any) {
    return [
      headers && headers.length && `${headers[0].message} in headers`,
      params && params.length && `${params[0].message} in params`,
      body && body.length && `${body[0].message} in body`,
      query && query.length && `${query[0].message} in query`,
    ]
      .filter(Boolean)
      .join();
  }
}

