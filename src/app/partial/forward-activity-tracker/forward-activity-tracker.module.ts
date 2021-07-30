import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForwardActivityTrackerRoutingModule } from './forward-activity-tracker-routing.module';
import { ForwardActivityTrackerComponent } from './forward-activity-tracker.component';
import { NgxSelectModule } from 'ngx-select-ex';


@NgModule({
  declarations: [
    ForwardActivityTrackerComponent
  ],
  imports: [
    CommonModule,
    ForwardActivityTrackerRoutingModule,
    NgxSelectModule
  ]
})
export class ForwardActivityTrackerModule { }
