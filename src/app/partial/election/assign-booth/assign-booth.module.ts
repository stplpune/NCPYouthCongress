import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignBoothRoutingModule } from './assign-booth-routing.module';
import { AssignBoothComponent } from './assign-booth.component';


@NgModule({
  declarations: [
    AssignBoothComponent
  ],
  imports: [
    CommonModule,
    AssignBoothRoutingModule
  ]
})
export class AssignBoothModule { }
