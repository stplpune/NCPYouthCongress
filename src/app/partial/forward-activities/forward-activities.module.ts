import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForwardActivitiesRoutingModule } from './forward-activities-routing.module';
import { ForwardActivitiesComponent } from './forward-activities.component';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    ForwardActivitiesComponent
  ],
  imports: [
    CommonModule,
    ForwardActivitiesRoutingModule,
    NgxSelectModule
  ]
})
export class ForwardActivitiesModule { }
