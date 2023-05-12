import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';

import { NotificationRoutingModule } from './notification-routing.module';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SharingModule } from '../shared/sharing.module';
 
@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    NgbModule, 
    NgbTooltipModule,
    HttpClientModule,
    SharingModule
  ]
})
export class NotificationModule { }
