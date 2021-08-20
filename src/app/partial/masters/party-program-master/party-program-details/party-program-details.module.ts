import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
import { PartyProgramDetailsRoutingModule } from './party-program-details-routing.module';
import { PartyProgramDetailsComponent } from './party-program-details.component';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GalleryModule } from '@ngx-gallery/core';

@NgModule({
  declarations: [
    PartyProgramDetailsComponent
  ],
  imports: [
    CommonModule,
    PartyProgramDetailsRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8',
      language: 'en',
      libraries: ['geometry','places']
    }),
    NgxPaginationModule,
    LightboxModule,
    GalleryModule
  ]
})
export class PartyProgramDetailsModule { }
