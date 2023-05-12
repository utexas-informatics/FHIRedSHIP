import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './shared/component/header/header.component';
import { AuthGuard } from './services/auth/auth-guards.service';
const routes: Routes = [
  {
    path: 'notifications',
    canActivate: [AuthGuard],
    component: HeaderComponent,
    loadChildren: () => import('./notification/notification.module').then((m) => m.NotificationModule),
  },
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    component: HeaderComponent,
    loadChildren: () => import('./task/task.module').then((m) => m.TaskModule),
  },
  {
    path: 'activities',
    canActivate: [AuthGuard],
    component: HeaderComponent,
    loadChildren: () => import('./activity/activity.module').then((m) => m.ActivityModule),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: HeaderComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'referrals',
    canActivate: [AuthGuard],
    component: HeaderComponent,
    loadChildren: () => import('./referral/referral.module').then((m) => m.ReferralModule),
  },
  {
    path: 'patients',
    canActivate: [AuthGuard],
    component: HeaderComponent,
    loadChildren: () =>
      import('./patient/patient.module').then((m) => m.PatientModule),
  },
  {
    path: 'callback/:patientId/:patientRefreshToken',
    loadChildren: () =>
      import('./callback/callback.module').then((m) => m.CallbackModule),
  },
  {
    path: 'callback',
    loadChildren: () =>
      import('./callback/callback.module').then((m) => m.CallbackModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./session/session.module').then((m) => m.SessionModule),
  },
  {
    path: 'chat/:moduleId',
    component: HeaderComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./message/message.module').then((m) => m.MessageModule),
  },
  {
    path: 'chat',
    component: HeaderComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./message/message.module').then((m) => m.MessageModule),
  },
  {
    path: 'settings',
    component: HeaderComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./settings/setting.module').then((m) => m.SettingModule),
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
