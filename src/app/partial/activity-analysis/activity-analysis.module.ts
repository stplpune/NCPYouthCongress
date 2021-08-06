import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityAnalysisRoutingModule } from './activity-analysis-routing.module';
import { ActivityAnalysisComponent } from './activity-analysis.component';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    ActivityAnalysisComponent
  ],
  imports: [
    CommonModule,
    ActivityAnalysisRoutingModule,
    NgxSelectModule
  ]
})
export class ActivityAnalysisModule { }
