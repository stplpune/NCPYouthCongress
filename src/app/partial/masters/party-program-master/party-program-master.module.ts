import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyProgramMasterRoutingModule } from './party-program-master-routing.module';
import { PartyProgramMasterComponent } from './party-program-master.component';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    PartyProgramMasterComponent
  ],
  imports: [
    CommonModule,
    PartyProgramMasterRoutingModule,
    NgxSelectModule
  ]
})
export class PartyProgramMasterModule { }
