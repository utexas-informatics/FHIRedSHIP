import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from "./list/list.component";
import { PatassesmentComponent } from "./patassesment/patassesment.component";
import { PatassesmentsComponent } from "./patassesments/patassesments.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ListComponent,
        pathMatch: "full",
      },
      {
      path: ':id/assesment/:aid/:sharedBy/:sharedTemp',
      component: PatassesmentComponent,
    },
    {
      path: ':id/response/:rid',
      component: PatassesmentComponent
    },
    {
      path: ':id/assesments',
      component: PatassesmentsComponent
    }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
