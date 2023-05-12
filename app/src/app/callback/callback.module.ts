import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallbackRoutingModule } from './callback-routing.module';
import { CallbackComponent } from './callback/callback.component';
import { SharingModule } from '../shared/sharing.module';

 
@NgModule({
  declarations: [
    CallbackComponent
  ], 
  imports: [
    CommonModule,
    CallbackRoutingModule,
    SharingModule
  ]
})
export class CallbackModule { }
