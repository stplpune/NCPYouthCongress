import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateElectionRoutingModule } from './create-election-routing.module';
import { CreateElectionComponent } from './create-election.component';


@NgModule({
  declarations: [
    CreateElectionComponent
  ],
  imports: [
    CommonModule,
    CreateElectionRoutingModule
  ]
})
export class CreateElectionModule { }
