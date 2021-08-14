import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityAnalysisRoutingModule } from './activity-analysis-routing.module';
import { ActivityAnalysisComponent } from './activity-analysis.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ActivityAnalysisComponent
  ],
  imports: [
    CommonModule,
    ActivityAnalysisRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCSDtf8g7XZ9B-P20ZqzOIr1TUQAg4Fj0',
      language: 'en',
      libraries: ['geometry','places']
    }),
  ]
})
export class ActivityAnalysisModule { }
