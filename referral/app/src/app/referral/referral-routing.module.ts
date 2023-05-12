import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralComponent } from "./referral/referral.component";
import { ReferralsComponent } from "./referrals/referrals.component";
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
        component: ReferralsComponent,
      },
      {
      path: 'new',
      component: ReferralComponent,
      },

     {
      path: 'edit/:id',
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
