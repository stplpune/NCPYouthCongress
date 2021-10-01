import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignAgentsToBoothsRoutingModule } from './assign-agents-to-booths-routing.module';
import { AssignAgentsToBoothsComponent } from './assign-agents-to-booths.component';


@NgModule({
  declarations: [
    AssignAgentsToBoothsComponent
  ],
  imports: [
    CommonModule,
    AssignAgentsToBoothsRoutingModule
  ]
})
export class AssignAgentsToBoothsModule { }
