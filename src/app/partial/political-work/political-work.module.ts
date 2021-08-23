import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliticalWorkRoutingModule } from './political-work-routing.module';
import { PoliticalWorkComponent } from './political-work.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxPaginationModule } from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AgmCoreModule } from '@agm/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';
import { TooltipModule } from '../directive/tooltip.module';
@NgModule({
  declarations: [
    PoliticalWorkComponent
  ],
  imports: [
    CommonModule,
    PoliticalWorkRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    LightboxModule,
    GalleryModule,
    TooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      language: 'en',
      libraries: ['geometry','places']
    }),
  ]
})
export class PoliticalWorkModule { }
