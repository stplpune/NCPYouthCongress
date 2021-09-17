import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitteesOnMapRoutingModule } from './committees-on-map-routing.module';
import { CommitteesOnMapComponent } from './committees-on-map.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CommitteesOnMapComponent
  ],
  imports: [
    CommonModule,
    CommitteesOnMapRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CommitteesOnMapModule { }
