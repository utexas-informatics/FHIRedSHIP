import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { LoginComponent } from './login/login.component';

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from '../services/auth/auth-interceptor.service';
import { ErrorInterceptorService } from '../error-interceptor.service';


@NgModule({
  declarations: [
    LoginComponent
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
  ],
   providers: [{
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true
  }]
})
export class SessionModule { }
