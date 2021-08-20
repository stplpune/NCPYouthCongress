import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityAnalysisRoutingModule } from './activity-analysis-routing.module';
import { ActivityAnalysisComponent } from './activity-analysis.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxPaginationModule } from 'ngx-pagination';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';

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
    LightboxModule,
    GalleryModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      language: 'en',
      libraries: ['geometry','places']
    }),
  ]
})
export class ActivityAnalysisModule { }
