import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliticalWorkRoutingModule } from './political-work-routing.module';
import { PoliticalWorkComponent } from './political-work.component';


@NgModule({
  declarations: [
    PoliticalWorkComponent
  ],
  imports: [
    CommonModule,
    PoliticalWorkRoutingModule
  ]
})
export class PoliticalWorkModule { }
