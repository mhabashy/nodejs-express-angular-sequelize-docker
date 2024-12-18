import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SortPipe} from '../pipes/sort.pipe';
import { DrawerComponent } from './drawer/drawer.component';
import {SidebarModule} from 'primeng/sidebar';
import {StandardDatePipe} from '../pipes/standard-date.pipe';
import {ButtonModule} from 'primeng/button';
import { DynamicModule } from 'ng-dynamic-component';



@NgModule({
  declarations: [
    SortPipe,
    DrawerComponent,
    StandardDatePipe,
  ],
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    DynamicModule
  ],
  exports: [
    DrawerComponent,
    StandardDatePipe,
    SortPipe
  ]
})
export class SharedModule { }
