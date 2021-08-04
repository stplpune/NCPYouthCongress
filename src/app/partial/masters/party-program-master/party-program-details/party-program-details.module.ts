import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyProgramDetailsRoutingModule } from './party-program-details-routing.module';
import { PartyProgramDetailsComponent } from './party-program-details.component';


@NgModule({
  declarations: [
    PartyProgramDetailsComponent
  ],
  imports: [
    CommonModule,
    PartyProgramDetailsRoutingModule
  ]
})
export class PartyProgramDetailsModule { }
