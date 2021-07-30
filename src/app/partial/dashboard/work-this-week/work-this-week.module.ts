import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkThisWeekRoutingModule } from './work-this-week-routing.module';
import { WorkThisWeekComponent } from './work-this-week.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


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
  ]
})
export class WorkThisWeekModule { }
