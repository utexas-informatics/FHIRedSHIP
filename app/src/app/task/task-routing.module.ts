import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from "./task/task.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: TaskComponent,
        pathMatch: "full",
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
