import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AddClinicEventComponent } from './add-clinic-event/add-clinic-event.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { EditClinicComponent } from './edit-clinic/edit-clinic.component';
import {ButtonModule} from 'primeng/button';
import {SidebarModule} from 'primeng/sidebar';
import {TableModule} from 'primeng/table';
import {AuthGuard} from '../services/auth.guard';
import {RouterModule} from '@angular/router';
import {TooltipModule} from 'primeng/tooltip';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { ViewPatientsComponent } from './view-patients/view-patients.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CardModule} from 'primeng/card';
import {SharedModule} from '../shared/shared.module';
import {ConfirmationService} from 'primeng/api';
import {InputMaskModule} from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';


const router = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [
    DashboardComponent,
    AddClinicEventComponent,
    AddPatientComponent,
    EditClinicComponent,
    EditPatientComponent,
    ViewPatientsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    ButtonModule,
    SidebarModule,
    TableModule,
    TooltipModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputSwitchModule,
    ConfirmDialogModule,
    CheckboxModule,
    CardModule,
    SharedModule,
    InputMaskModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class DashboardModule { }
