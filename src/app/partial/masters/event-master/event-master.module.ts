import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventMasterRoutingModule } from './event-master-routing.module';
import { EventMasterComponent } from './event-master.component';


@NgModule({
  declarations: [
    EventMasterComponent
  ],
  imports: [
    CommonModule,
    EventMasterRoutingModule
  ]
})
export class EventMasterModule { }
