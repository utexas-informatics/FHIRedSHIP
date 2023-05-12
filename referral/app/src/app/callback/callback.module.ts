import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS } from "@angular/common/http";
import { CallbackRoutingModule } from './callback-routing.module';
import { CallbackComponent } from './callback/callback.component';
import { AuthInterceptorService } from '../services/auth/auth-interceptor.service';
import { ErrorInterceptorService } from '../error-interceptor.service';


@NgModule({
  declarations: [
    CallbackComponent
  ],
  imports: [
    CommonModule,
    CallbackRoutingModule
  ],
    providers:[{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },{
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }]
})
export class CallbackModule { }
