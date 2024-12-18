import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DiocesesService} from '../services/dioceses.service';
import {StminaclinicService} from '../services/stminaclinic.service';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PanelModule} from 'primeng/panel';
import {InputMaskModule} from 'primeng/inputmask';
import {MessageModule} from 'primeng/message';
import {CheckboxModule} from 'primeng/checkbox';
import {ConfirmationService} from 'primeng/api';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import { PsychiatristComponent } from './psychiatrist/psychiatrist.component';
import {RadioButtonModule} from 'primeng/radiobutton';


const calendarRouting = [
  {
    path: '',
    component: CalendarComponent,
  },
  {
    path: 'behavioral-health',
    component: PsychiatristComponent,
  }
];

@NgModule({
  declarations: [CalendarComponent, PsychiatristComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(calendarRouting),
    FormsModule,
    SelectButtonModule,
    SidebarModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    PanelModule,
    InputMaskModule,
    MessageModule,
    CheckboxModule,
    DropdownModule,
    MultiSelectModule,
    ToggleButtonModule,
    RadioButtonModule
  ],
  providers: [
    DiocesesService,
    ConfirmationService,
    StminaclinicService
  ]
})
export class EventCalendarModule { }
