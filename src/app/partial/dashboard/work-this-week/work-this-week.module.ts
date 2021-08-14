import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkThisWeekRoutingModule } from './work-this-week-routing.module';
import { WorkThisWeekComponent } from './work-this-week.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  declarations: [
    WorkThisWeekComponent
  ],
  imports: [
    CommonModule,
    WorkThisWeekRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule
  ]
})
export class WorkThisWeekModule { }
