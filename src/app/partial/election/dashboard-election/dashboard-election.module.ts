import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardElectionRoutingModule } from './dashboard-election-routing.module';
import { DashboardElectionComponent } from './dashboard-election.component';


@NgModule({
  declarations: [
    DashboardElectionComponent
  ],
  imports: [
    CommonModule,
    DashboardElectionRoutingModule
  ]
})
export class DashboardElectionModule { }
