import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from "./shared/component/header/header.component";
import { AuthGuard } from './services/auth/auth-guards.service';

const routes: Routes = [ 
  {
    path: "dashboard",
    component: HeaderComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  }, 
  {
    path: 'callback/:patientToken',
    loadChildren: () =>
      import('./callback/callback.module').then((m) => m.CallbackModule),
  }, 
  {
    path: 'callback',
    loadChildren: () =>
      import('./callback/callback.module').then((m) => m.CallbackModule),
  },
  {
    path: "patient",
    component: HeaderComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./patient/patient.module").then((m) => m.PatientModule),
  },
  {
    path: "assessment",
    component: HeaderComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./assessment/assessment.module").then((m) => m.AssessmentModule),
  },
   {
    path: "referral",
    component: HeaderComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./referral/referral.module").then((m) => m.ReferralModule),
  },
  { 
    path: "",
    //canActivate: [AuthGuard],
    loadChildren: () =>
    import("./session/session.module").then((m) => m.SessionModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
