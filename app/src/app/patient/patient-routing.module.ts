import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsComponent } from "./patients/patients.component";
import { AssesmentsComponent } from "./assesments/assesments.component";
import { PatassesmentComponent} from "./patassesment/patassesment.component";
import { AuthGuard } from '../services/auth/auth-guards.service';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: PatientsComponent,
        pathMatch: "full",
      },
      {
      path: ':id/response/:rid',
      canActivate: [AuthGuard],
      component: PatassesmentComponent,
      },
      {
      path: ':id/assessments',
      canActivate: [AuthGuard],
      component: AssesmentsComponent,
      }
    ],
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
