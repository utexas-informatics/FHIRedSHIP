import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MessageRoutingModule } from './message-routing.module';
import { SharingModule } from '../shared/sharing.module';
import { ChatComponent } from './chat/chat.component';


@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    MessageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharingModule
  ]
})
export class MessageModule { }
