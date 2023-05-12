import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { ReferralComponent } from './referral/referral.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { ReferralRoutingModule } from './referral-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharingModule } from '../shared/sharing.module';

@NgModule({
  declarations: [
    ReferralComponent,
    ReferralsComponent
  ],
  imports: [
    CommonModule,
    ReferralRoutingModule,
    HttpClientModule,
    NgbModule, 
    NgbTooltipModule,
    SharingModule,
    FormsModule
  ]
})
export class ReferralModule { }