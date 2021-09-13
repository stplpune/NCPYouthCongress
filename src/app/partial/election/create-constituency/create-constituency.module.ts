import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateConstituencyRoutingModule } from './create-constituency-routing.module';
import { CreateConstituencyComponent } from './create-constituency.component';


@NgModule({
  declarations: [
    CreateConstituencyComponent
  ],
  imports: [
    CommonModule,
    CreateConstituencyRoutingModule
  ]
})
export class CreateConstituencyModule { }
