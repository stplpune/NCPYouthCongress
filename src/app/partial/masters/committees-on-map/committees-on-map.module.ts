import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitteesOnMapRoutingModule } from './committees-on-map-routing.module';
import { CommitteesOnMapComponent } from './committees-on-map.component';


@NgModule({
  declarations: [
    CommitteesOnMapComponent
  ],
  imports: [
    CommonModule,
    CommitteesOnMapRoutingModule
  ]
})
export class CommitteesOnMapModule { }
