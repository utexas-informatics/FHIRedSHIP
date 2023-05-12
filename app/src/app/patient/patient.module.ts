import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsComponent } from './patients/patients.component';
import { AssesmentsComponent } from './assesments/assesments.component';
import { PatassesmentComponent } from './patassesment/patassesment.component';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientService } from './patient.service';
import { SharingModule } from '../shared/sharing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    PatientsComponent,
    AssesmentsComponent,
    PatassesmentComponent,
   // IframeComponent
  ],
  imports: [
    CommonModule,
     SharingModule,
    PatientRoutingModule,
    FormsModule,
    NgbTooltipModule,
    NgbModule

  ],
   providers:[PatientService]
})
export class PatientModule { }
