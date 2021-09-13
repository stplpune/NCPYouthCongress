import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignBothRoutingModule } from './assign-both-routing.module';
import { AssignBothComponent } from './assign-both.component';


@NgModule({
  declarations: [
    AssignBothComponent
  ],
  imports: [
    CommonModule,
    AssignBothRoutingModule
  ]
})
export class AssignBothModule { }
