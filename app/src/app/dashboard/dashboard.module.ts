import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { SharingModule } from '../shared/sharing.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule, 
    FormsModule, 
    HttpClientModule,
    NgbModule,
    NgbTooltipModule,
    SharingModule
  ],
  providers:[]
  /*  providers:[{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },
  {
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }
  ]*/
})
export class DashboardModule { }
