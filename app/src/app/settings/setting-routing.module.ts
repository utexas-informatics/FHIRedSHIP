import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: SettingComponent,
        pathMatch: "full",
      },
    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
