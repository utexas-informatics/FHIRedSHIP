import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralComponent } from "./referral/referral.component";
import { ReferralsComponent } from "./referrals/referrals.component";
import { AuthGuard } from '../services/auth/auth-guards.service';
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ReferralsComponent,
        pathMatch: "full",
      },
      {
        path: "patient/:id",
        canActivate: [AuthGuard],
        component: ReferralsComponent,
      },
      {
      path: ':id',
      canActivate: [AuthGuard],
      component: ReferralComponent,
      },
     {
      path: 'patient/:patId/:id',
      canActivate: [AuthGuard],
      component: ReferralComponent,
     },
    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralRoutingModule { }