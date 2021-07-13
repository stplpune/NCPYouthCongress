import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkThisWeekRoutingModule } from './work-this-week-routing.module';
import { WorkThisWeekComponent } from './work-this-week.component';


@NgModule({
  declarations: [
    WorkThisWeekComponent
  ],
  imports: [
    CommonModule,
    WorkThisWeekRoutingModule
  ]
})
export class WorkThisWeekModule { }
