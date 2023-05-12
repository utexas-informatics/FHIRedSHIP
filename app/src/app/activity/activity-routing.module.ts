import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from "./activities/activities.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ActivitiesComponent,
        pathMatch: "full",
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
