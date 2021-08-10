import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgmCoreModule } from '@agm/core';
import { PartyProgramDetailsRoutingModule } from './party-program-details-routing.module';
import { PartyProgramDetailsComponent } from './party-program-details.component';


@NgModule({
  declarations: [
    PartyProgramDetailsComponent
  ],
  imports: [
    CommonModule,
    PartyProgramDetailsRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCSDtf8g7XZ9B-P20ZqzOIr1TUQAg4Fj0',
      language: 'en',
      libraries: ['geometry','places']
    }),
    NgxPaginationModule
  ]
})
export class PartyProgramDetailsModule { }
