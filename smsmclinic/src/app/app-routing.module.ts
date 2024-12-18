import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login/login.component';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(
        m => m.LoginModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./calendar/event-calendar.module').then(
        m => m.EventCalendarModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
