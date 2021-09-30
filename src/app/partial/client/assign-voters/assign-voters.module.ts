import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignVotersRoutingModule } from './assign-voters-routing.module';
import { AssignVotersComponent } from './assign-voters.component';


@NgModule({
  declarations: [
    AssignVotersComponent
  ],
  imports: [
    CommonModule,
    AssignVotersRoutingModule
  ]
})
export class AssignVotersModule { }
