import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { LoginComponent } from './login/login.component';

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from './../auth-interceptor.service';
import { SharingModule } from '../shared/sharing.module';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [
    LoginComponent,
    ResetComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    ReactiveFormsModule, 
    FormsModule, 
    NgbModule, 
    NgbTooltipModule,
    FormsModule,
    HttpClientModule,
    SharingModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  }

  /*{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },
  {
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }*/
  ]
})
export class SessionModule { }
