import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { ReferralRoutingModule } from './referral-routing.module';
import { HttpClientModule,HttpClient ,HTTP_INTERCEPTORS} from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReferralComponent } from './referral/referral.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
//import {AppModule} from '../app.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AutocompleteComponent } from '../shared/component/autocomplete/autocomplete.component';
import { AuthInterceptorService } from '../services/auth/auth-interceptor.service';
import { ErrorInterceptorService } from '../error-interceptor.service';

@NgModule({
  declarations: [
    ReferralComponent,
    ReferralsComponent,
    AutocompleteComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    ReferralRoutingModule,
    ClickOutsideModule,
    NgbModule,
    //AppModule
    //AutocompleteComponent
  ],
  exports: [AutocompleteComponent],
    providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  },{
    provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi:true
  }
  ]
})
export class ReferralModule { }
