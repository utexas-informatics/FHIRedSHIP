import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { PatientRoutingModule } from './patient-routing.module';
import { ListComponent } from './list/list.component';
import { PatientService } from "./patient.service";
import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PatassesmentComponent } from './patassesment/patassesment.component';
import { PatassesmentsComponent } from './patassesments/patassesments.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthInterceptorService } from '../services/auth/auth-interceptor.service';
import { ErrorInterceptorService } from '../error-interceptor.service';


@NgModule({
  declarations: [
    ListComponent,
    PatassesmentComponent,
    PatassesmentsComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    NgbModule,
    NgbTooltipModule
  ],
  providers: [
    PatientService,{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },{
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }
  ]
})
export class PatientModule { }
