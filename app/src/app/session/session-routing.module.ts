import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: LoginComponent,
        pathMatch: "full",
      },
      {
        path: 'reset/:id',
        component: ResetComponent,
      }
    ],
  },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
