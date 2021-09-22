import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CDashboardRoutingModule } from './c-dashboard-routing.module';
import { CDashboardComponent } from './c-dashboard.component';


@NgModule({
  declarations: [
    CDashboardComponent
  ],
  imports: [
    CommonModule,
    CDashboardRoutingModule
  ]
})
export class CDashboardModule { }
