import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectionProfileRoutingModule } from './election-profile-routing.module';
import { ElectionProfileComponent } from './election-profile.component';


@NgModule({
  declarations: [
    ElectionProfileComponent
  ],
  imports: [
    CommonModule,
    ElectionProfileRoutingModule
  ]
})
export class ElectionProfileModule { }
