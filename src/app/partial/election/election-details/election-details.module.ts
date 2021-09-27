import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectionDetailsRoutingModule } from './election-details-routing.module';
import { ElectionDetailsComponent } from './election-details.component';


@NgModule({
  declarations: [
    ElectionDetailsComponent
  ],
  imports: [
    CommonModule,
    ElectionDetailsRoutingModule
  ]
})
export class ElectionDetailsModule { }
