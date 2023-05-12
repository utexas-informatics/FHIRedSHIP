import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/component/header/header.component';
import { PatientService } from "./patient/patient.service";
import { AssessmentService } from "./assessment/assessment.service";
import { CommonModule } from "@angular/common";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { UserService } from './user.service';
import { LocalStore } from "./shared/service/localstore/localstore.service";

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from './services/auth/auth-interceptor.service';
import { ErrorInterceptorService } from './error-interceptor.service';
import { AuthGuard } from './services/auth/auth-guards.service';
import { ReferralService } from './services/referral/referral.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AutocompleteLibModule } from 'angular-ng-autocomplete';
//import { AutocompleteComponent } from './shared/component/autocomplete/autocomplete.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularMultiSelectModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule, 
    NgbTooltipModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [PatientService,AssessmentService,UserService,AuthGuard,ReferralService, {
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },{
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }],
  //exports: [AutocompleteComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

