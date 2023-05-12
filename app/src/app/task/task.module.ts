import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task/task.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SharingModule } from '../shared/sharing.module';
 

@NgModule({
  declarations: [
    TaskComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    ReactiveFormsModule, 
    FormsModule,
    NgbModule, 
    NgbTooltipModule,
    HttpClientModule,
    SharingModule
  ]
})
export class TaskModule { }
