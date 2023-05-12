import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: CallbackComponent,
        pathMatch: "full",
      },
    ],
  }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallbackRoutingModule { }
