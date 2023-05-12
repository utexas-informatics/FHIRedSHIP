import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReferralModule} from '../referral/referral.module';
import { AssessmentRoutingModule } from './assessment-routing.module';
import { ListComponent } from './list/list.component';
import { AssessmentService } from "./assessment.service";
import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AutocompleteComponent } from '../shared/component/autocomplete/autocomplete.component';
import { AuthInterceptorService } from '../services/auth/auth-interceptor.service';
import { ErrorInterceptorService } from '../error-interceptor.service';
 
@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    AssessmentRoutingModule,
    HttpClientModule,
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    ReferralModule
  ],
  providers:[AssessmentService,{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },{
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }]
})
export class AssessmentModule { }
