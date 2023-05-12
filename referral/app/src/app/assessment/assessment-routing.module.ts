import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ListComponent,
        pathMatch: "full",
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentRoutingModule { }
