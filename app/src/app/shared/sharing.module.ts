import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IframesComponent } from './component/iframes/iframes.component';
import { ConditionscreenComponent } from './component/conditionscreen/conditionscreen.component';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { MessageComponent } from './component/message/message.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { FileuploadComponent } from './component/fileupload/fileupload.component';
import { NgxFileDropModule } from 'ngx-file-drop';
//import { BrowserModule } from '@angular/platform-browser';

import { TaskComponent } from './component/task/task.component';
import { ActivityComponent } from './component/activity/activity.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { RecentnotificationComponent } from './component/recentnotification/recentnotification.component';
import { FormComponent } from './component/forms/form/form.component';
import { InputComponent } from './component/forms/elements/input/input.component';
import { TextareaComponent } from './component/forms/elements/textarea/textarea.component';
import { SelectComponent } from './component/forms/elements/select/select.component';
import { DateComponent } from './component/forms/elements/date/date.component';
import { CheckboxComponent } from './component/forms/elements/checkbox/checkbox.component';
import { RadioComponent } from './component/forms/elements/radio/radio.component';
import { NumberComponent } from './component/forms/elements/number/number.component';
import { AppointmentComponent } from './component/appointment/appointment.component';
import { ListComponent } from './component/forms/list/list.component';
import { AutocompleteComponent } from './component/autocomplete/autocomplete.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { RecenttaskComponent } from './component/recenttask/recenttask.component';
import { ReferralstatusComponent } from './component/referralstatus/referralstatus.component';
import { ConfirmationComponent } from './component/confirmation/confirmation.component';



@NgModule({
  declarations: [
    IframesComponent,
    ConditionscreenComponent,
    MessageComponent,
    SpinnerComponent,
    FileuploadComponent,
    TaskComponent,
    ActivityComponent,
    RecentnotificationComponent,
    FormComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    DateComponent,
    CheckboxComponent,
    RadioComponent,
    NumberComponent,
    AppointmentComponent,
    ListComponent,
    AutocompleteComponent,
    RecenttaskComponent,
    ReferralstatusComponent,
    ConfirmationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    NgbModule,
    AutocompleteLibModule,
    NgbTooltipModule,
    ClickOutsideModule
  ],
   providers: [],
  exports: [IframesComponent,ConditionscreenComponent,MessageComponent,SpinnerComponent,FileuploadComponent,TaskComponent,ActivityComponent,RecentnotificationComponent,FormComponent,InputComponent,TextareaComponent,SelectComponent,DateComponent,CheckboxComponent,RadioComponent,NumberComponent,ListComponent,AppointmentComponent,AutocompleteComponent,RecenttaskComponent,ReferralstatusComponent,ConfirmationComponent]

})
export class SharingModule { }
