import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/component/header/header.component';
import { AuthService } from "./shared/service/auth/auth.service";
import { MesageService } from "./shared/service/message/mesage.service";
import { LocalstoreService } from "./shared/service/localstore/localstore.service";

import { UserService } from './user.service';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule, FormsModule } from "@angular/forms";


import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { ErrorInterceptorService } from './error-interceptor.service';
import { AuthGuard } from './services/auth/auth-guards.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

import {SafeHtmlPipe} from './pipes/safemode';
const config: SocketIoConfig = { url: environment.socketUrl, options: {transports: ['websocket'], upgrade: false,reconnectionDelay:50,reconnectionDelayMax:500,randomizationFactor:0.1} };
import { NotificationService } from './services/notification/notification.service';
import { ConditionService } from './services/condition/condition.service';
import { QuestionnaireresponseService } from './services/questionnaireresponse/questionnaireresponse.service';
import { ReferralService } from './services/referral/referral.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskService } from './services/task/task.service';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';

import { FileuploadService } from './services/fileupload/fileupload.service';
import { AppointmentService } from './services/appointment/appointment.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SafeHtmlPipe,
    //IframeComponent
    
  /*  NgbModule, 
    NgbTooltipModule*/
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule, 
    NgbTooltipModule,
    ReactiveFormsModule, 
    FormsModule,
    HttpClientModule,
    AutocompleteLibModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  exports:[SafeHtmlPipe],
  providers: [AuthService,MesageService,UserService,AuthGuard,NotificationService,ConditionService,QuestionnaireresponseService,ReferralService,FileuploadService,TaskService,AutocompleteService,AppointmentService,{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },{
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }]
/*  providers: [AuthService,MesageService,UserService,{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },
  {
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }]*/,
  bootstrap: [AppComponent]
})
export class AppModule { }
