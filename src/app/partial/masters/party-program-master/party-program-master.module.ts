import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyProgramMasterRoutingModule } from './party-program-master-routing.module';
import { PartyProgramMasterComponent } from './party-program-master.component';


@NgModule({
  declarations: [
    PartyProgramMasterComponent
  ],
  imports: [
    CommonModule,
    PartyProgramMasterRoutingModule
  ]
})
export class PartyProgramMasterModule { }
