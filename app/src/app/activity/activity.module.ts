import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityRoutingModule } from './activity-routing.module';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http';
import { SharingModule } from '../shared/sharing.module';
@NgModule({
  declarations: [
    ActivitiesComponent
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    NgbModule, 
    NgbTooltipModule,
    HttpClientModule,
    SharingModule
  ],
  providers:[]
})
export class ActivityModule { }
